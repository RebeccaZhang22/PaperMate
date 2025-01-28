from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404
from .models import Papers
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.db.models import Q
from django.http import JsonResponse
from .serializers import PaperSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

def filter_papers_by_year(papers_queryset):
    return papers_queryset.filter(
        Q(comment__icontains='2022') | 
        Q(comment__icontains='2023') | 
        Q(comment__icontains='2024') | 
        Q(comment__icontains='2025')
    )

def get_paginated_context(paper_list, page_number):
    paginator = Paginator(paper_list, 20)
    page_obj = paginator.get_page(page_number)
    return page_obj

@api_view(['GET'])
def paper_list(request):
    """
    获取论文列表
    GET 参数:
    - page: 页码
    - keyword: 搜索关键词
    - is_published: 是否只显示已发布论文 ("1"/"0")
    - title_search: 标题搜索
    """
    # 获取查询参数
    page = request.GET.get('page', 1)
    keyword = request.GET.get('keyword', '')
    is_published = request.GET.get('is_published', '0')
    title_search = request.GET.get('title_search', '').strip()
    
    # 基础查询集
    filtered_papers = Papers.objects.all().order_by('-published')
    
    # 应用过滤条件
    if is_published == "1":
        filtered_papers = filter_papers_by_year(filtered_papers)
        
    if keyword:
        filtered_papers = filtered_papers.filter(
            Q(title__icontains=keyword) | 
            Q(abstract__icontains=keyword)
        )
        
    if title_search:
        filtered_papers = filtered_papers.filter(title__icontains=title_search)
    
    # 分页
    paginator = Paginator(filtered_papers, 20)
    page_obj = paginator.get_page(page)
    
    # 返回响应
    return Response({
        'page_obj': PaperSerializer(page_obj, many=True).data,
        'total_pages': paginator.num_pages,
        'keywords': ['forecasting', 'generation', 'augmentation', 'anomaly detection', 'generative model'],
        'selected_keyword': keyword,
        'is_published': is_published,
        'title_search': title_search,
    })

@api_view(['GET'])
def paper_detail(request, paper_id):
    """
    获取单个论文详情
    URL 参数:
    - paper_id: 论文ID
    """
    try:
        paper = get_object_or_404(Papers, entry_id=paper_id)
        return Response(PaperSerializer(paper).data)
    except Papers.DoesNotExist:
        return Response({'error': '论文未找到'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def paper_recommendations(request):
    """
    获取论文推荐列表
    GET 参数:
    - paper_id: 目标论文ID
    """
    paper_id = request.GET.get('paper_id')
    if not paper_id:
        return Response(
            {'error': '缺少必要参数 paper_id'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # 获取目标论文
        paper = Papers.objects.get(entry_id=paper_id)
        target_keywords = paper.keywords
        
        # 获取其他论文
        other_papers = Papers.objects.exclude(entry_id=paper.entry_id)
        keywords = [p.keywords for p in other_papers]
        
        # 计算相似度
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform(keywords + [target_keywords])
        cosine_similarities = cosine_similarity(vectors[-1], vectors[:-1]).flatten()
        
        # 获取最相似的论文
        most_similar_paper_indices = cosine_similarities.argsort()[-5:][::-1]
        recommended_papers = [other_papers[int(i)] for i in most_similar_paper_indices]
        
        return Response({
            'selected_paper': PaperSerializer(paper).data,
            'recommended_papers': PaperSerializer(recommended_papers, many=True).data
        })
    except Papers.DoesNotExist:
        return Response(
            {'error': '论文未找到'}, 
            status=status.HTTP_404_NOT_FOUND
        )


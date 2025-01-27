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
        Q(comment__icontains='2023') | 
        Q(comment__icontains='2024') | 
        Q(comment__icontains='2025')
    )

def get_paginated_context(paper_list, page_number):
    paginator = Paginator(paper_list, 20)
    page_obj = paginator.get_page(page_number)
    return page_obj

@api_view(['GET', 'POST'])
def paper_list(request):
    # 符合条件的论文列表
    selected_keyword = request.data.get('keyword') if request.method == 'POST' else None
    only_published = request.data.get('published_filter') if request.method == 'POST' else None
    
    if only_published:
        filtered_papers = filter_papers_by_year(Papers.objects.all()).order_by('-published')
    else:
        filtered_papers = Papers.objects.all().order_by('-published')
        
    if selected_keyword:
        filtered_papers = filtered_papers.filter(
            Q(title__icontains=selected_keyword) | 
            Q(abstract__icontains=selected_keyword)
        )
    
    if request.method == 'POST':
        paper_id = request.data.get('find_similar_paper')
        try:
            paper = Papers.objects.get(entry_id=paper_id)
            target_keywords = paper.keywords
            
            other_papers = filtered_papers.exclude(entry_id=paper.entry_id)
            keywords = [p.keywords for p in other_papers]
            
            vectorizer = TfidfVectorizer()
            vectors = vectorizer.fit_transform(keywords + [target_keywords])
            cosine_similarities = cosine_similarity(vectors[-1], vectors[:-1]).flatten()
            
            most_similar_paper_indices = cosine_similarities.argsort()[-5:][::-1]
            recommended_papers = [other_papers[int(i)] for i in most_similar_paper_indices]
            
            return Response({
                'selected_paper': PaperSerializer(paper).data,
                'recommended_papers': PaperSerializer(recommended_papers, many=True).data
            })
        except Papers.DoesNotExist:
            return Response({'error': 'Paper not found'}, status=status.HTTP_404_NOT_FOUND)

    page_obj = get_paginated_context(filtered_papers, request.GET.get('page'))
    return Response(PaperSerializer(page_obj, many=True).data)

@api_view(['GET'])
def paper_detail(request, paper_id):
    try:
        paper = get_object_or_404(Papers, entry_id=paper_id)
        return Response(PaperSerializer(paper).data)
    except Papers.DoesNotExist:
        return Response({'error': 'Paper not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def main_view(request):
    keywords = ['forecasting', 'generation', 'augmentation', 'anomaly detection', 'generative model']
    selected_keyword = request.GET.get('keyword')
    only_published = request.GET.get('published_filter', 'no')
    title_search = request.GET.get('title_search', '').strip()
    
    if only_published == 'yes':
        filtered_papers = filter_papers_by_year(Papers.objects.all()).order_by('-published')
    else:
        filtered_papers = Papers.objects.all().order_by('-published')
        
    if selected_keyword:
        paper_list = filtered_papers.filter(
            Q(title__icontains=selected_keyword) | 
            Q(abstract__icontains=selected_keyword)
        )
    else:
        paper_list = filtered_papers
        
    if title_search:
        paper_list = paper_list.filter(title__icontains=title_search)
    
    page_obj = get_paginated_context(paper_list, request.GET.get('page'))
    
    return Response({
        'page_obj': PaperSerializer(page_obj, many=True).data,
        'keywords': keywords,
        'selected_keyword': selected_keyword,
        'published_filter': only_published,
        'title_search': title_search,
    })

# api: papers/<str:keyword>/<int:only_published>/<int:page_id>/

# def main_view(request):
#     # 如果没有提供关键词，则默认使用空字符串
#     selected_keyword = request.GET.get('keyword', '')
#     only_published = request.GET.get('published_filter', 0)
#     title_search = request.GET.get('title_search', '').strip()
#     page_id = request.GET.get('page', 1)
    
#     if only_published == 1:
#         paper_list = filter_papers_by_year(Papers.objects.all()).order_by('-published')
#     else:
#         paper_list = Papers.objects.all().order_by('-published')
#     if selected_keyword:
#         paper_list = paper_list.filter(
#             Q(title__icontains=selected_keyword) | 
#             Q(abstract__icontains=selected_keyword)
#         )
#     else:
#         paper_list = paper_list
#     if title_search:
#         paper_list = paper_list.filter(title__icontains=title_search)
    
#     page_obj = get_paginated_context(paper_list, page_id)
    
#     all_paper_data = PaperSerializer(page_obj, many=True).data
#     print(all_paper_data)
#     return JsonResponse(all_paper_data, safe=False)
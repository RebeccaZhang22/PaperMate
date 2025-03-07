from django.urls import path
from . import views

urlpatterns = [
    # path('', views.main_view, name='main_page'),
    path('', views.paper_list, name='paper_list'),
    path('recommendations/', views.paper_recommendations, name='paper_recommendations'),
    path('<path:paper_id>/', views.paper_detail, name='paper_detail'),
]


from rest_framework import serializers
from .models import Papers

class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Papers
        fields = ['entry_id', 'title', 'published', 'authors', 'comment', 'primary_category', 'categories', 'abstract', 'keywords']

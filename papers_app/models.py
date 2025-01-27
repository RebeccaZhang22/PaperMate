# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Papers(models.Model):
    entry_id = models.TextField(primary_key=True, blank=True)
    title = models.TextField(blank=True, null=True)
    published = models.TextField(blank=True, null=True)
    authors = models.TextField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    primary_category = models.TextField(blank=True, null=True)
    categories = models.TextField(blank=True, null=True)
    abstract = models.TextField(blank=True, null=True)
    keywords = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'papers'

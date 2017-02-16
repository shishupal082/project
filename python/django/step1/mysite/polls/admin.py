# ----- v1
# from django.contrib import admin
# from polls.models import Question
# admin.site.register(Question)

from django.contrib import admin

# ----- v3
# from polls.models import Question

from polls.models import Choice, Question

# ----- v2
# class QuestionAdmin(admin.ModelAdmin):
#     fields = ['pub_date', 'question_text']

# ----- v4, v6
# class ChoiceInline(admin.StackedInline):
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 3

# ----- v5
# class QuestionAdmin(admin.ModelAdmin):
#     fieldsets = [
#         (None,               {'fields': ['question_text']}),
#         ('Date information', {'fields': ['pub_date']}),
#     ]

class QuestionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['question_text']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]
    inlines = [ChoiceInline]
    # ----- v7
    list_display = ('question_text', 'pub_date')
    list_filter = ['pub_date']
    search_fields = ['question_text']


admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice)
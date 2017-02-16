from django.http import HttpResponse, JsonResponse
import simplejson
from polls.models import Question

def index(request):
    data = {}
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    for question in latest_question_list:
        data[question.id] = question.question_text
    return HttpResponse(simplejson.dumps(data))

def detail(request, question_id):
    data = {}
    try:
        question = Question.objects.get(pk=question_id)
        data["question"] = question.question_text
        data["choice"] = []

        for choice in question.choice_set.all():
            data["choice"].append({"id" : choice.id, "text":choice.choice_text})

    except Question.DoesNotExist:
        raise Http404("Question does not exist")
    return HttpResponse(simplejson.dumps(data))
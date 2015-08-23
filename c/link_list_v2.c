#include <stdio.h>
#include <stdlib.h>

struct linklist{
  struct linklist *next;
  int value;
};

void display_v1(struct linklist *);
void display_v2(struct linklist **);
void display_v3(struct linklist **);

int main(){
	struct linklist *head = NULL;
	struct linklist *newnode = NULL, *newnode2 = NULL;
	struct linklist *temp = NULL;
	newnode = (struct linklist*)malloc(sizeof(struct linklist));
	newnode->next = NULL;
	newnode->value = 0;

	newnode2 = (struct linklist*)malloc(sizeof(struct linklist));
	newnode2->next = NULL;
	newnode2->value = 1;

	newnode->next = newnode2;

	head = newnode;
	temp = head;
	while(temp != NULL){
		printf("%d\n",temp->value);
		temp = temp->next;
	}
	printf("Basic display linklist\n");
	display_v1(head);
	display_v2(&head);
	display_v1(head);
	display_v2(&head);
	display_v3(&head);
	display_v1(head);
	display_v2(&head);
	display_v3(&head);
	printf("\n");
	return(0);
}
void display_v1(struct linklist *head){
	if(head == NULL){
		printf("Empty list v1\n");
		return;
	}
	while(head != NULL){
		printf("%d\n",head->value);
		head = head->next;
	}
	printf("End of display v1\n");
}
void display_v2(struct linklist **head){
	if(*head == NULL){
		printf("Empty list v2\n");
		return;
	}
	struct linklist *temp = NULL;
	temp = *head;
	while(temp != NULL){
		printf("%d\n",temp->value);
		temp = temp->next;
	}
	printf("End of display v2\n");
}
void display_v3(struct linklist **head){
	if(*head == NULL){
		printf("Empty list v3\n");
		return;
	}
	while(*head != NULL){
		printf("%d\n",(*head)->value);
		(*head) = (*head)->next;
	}
	printf("End of display v3\n");
}
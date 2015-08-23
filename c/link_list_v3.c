#include <stdio.h>
#include <stdlib.h>

struct linklist{
  struct linklist *next;
  int value;
};

void display(struct linklist *);
void insert(struct linklist **, int number);

int main(){
	struct linklist *head = NULL;
	insert(&head, 0);
	display(head);
	insert(&head, 1);
	display(head);
	printf("\n");
	return(0);
}
void insert(struct linklist **head, int number){
	struct linklist *newnode = NULL;
	newnode = (struct linklist*)malloc(sizeof(struct linklist));
	newnode->next = NULL;
	newnode->value = number;
	if(*head != NULL){
		newnode->next = (*head);
	}
	(*head) = newnode;
}
void display(struct linklist *head){
	if(head == NULL){
		printf("Empty linklist\n");
		return;
	}
	while(head != NULL){
		printf("%d\n",head->value);
		head = head->next;
	}
	printf("End of display\n");
}
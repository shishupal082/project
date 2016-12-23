#include <stdio.h>
#include <stdlib.h>

typedef struct node{
  struct node *next;
  int value;
}mynode;

void insert(mynode **,int);
void display(mynode *);

int main(){
	mynode *head=NULL;
	int element=0;
	printf("enter the element to be inserted : ");
	scanf("%d",&element);
	printf("%d\n", element);
	insert(&head,element);
	display(head);
	return(0);	
}
void insert(mynode **head,int value){
	mynode *newnode=NULL;
	newnode = (mynode *)malloc(sizeof(struct node));
	if(NULL==newnode){
	  printf("memory failure occured\n");
	}

	newnode->next = NULL;
	newnode->value = value;
	
	if(NULL != (*head)) {
		newnode->next = (*head);
	}
	(*head) = newnode;
}
void display(mynode *head){
	if(head == NULL){
		printf("Empty node\n");
		return;
	}
	while(head != NULL){
		printf("%d\n",head->value);
		head = head->next;
	}
	printf("End of display\n");
}
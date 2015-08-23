#include <stdio.h>
#include <stdlib.h>

struct linklist{
  struct linklist *next;
  int value;
};

int main(){
	struct linklist *head = NULL;
	struct linklist *newnode = NULL;
	struct linklist *temp = NULL;
	newnode = (struct linklist*)malloc(sizeof(struct linklist));
	newnode->next = NULL;
	newnode->value = 0;
	head = newnode;
	temp = head;
	while(temp != NULL){
		printf("%d\n",temp->value);
		temp = temp->next;
	}
	printf("\n");
	return(0);
}
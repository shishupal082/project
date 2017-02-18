//A program to rotate a linked list counter clock wise
 
#include<stdio.h>
// #include<conio.h>
#include<stdlib.h>
struct node
{
    int data;
    struct node* next;
};
void push(struct node** head_ref, int new_data)
{
     struct node* new_node = (struct node*) malloc(sizeof(struct node));
     new_node->data = new_data;
     new_node->next = (*head_ref);
     (*head_ref) = new_node;
}
void rotate(struct node **head_ref, int k)
{
     if (k == 0)
       return;
    struct node* current = *head_ref;
    int count = 1;
    while (count < k && current != NULL)
    {
        current = current->next;
        count++;
    }
    if (current == NULL)
        return;
    struct node *kthNode = current;
    while (current->next != NULL)
        current = current->next;
    current->next = *head_ref;
    *head_ref = kthNode->next;
    kthNode->next = NULL;
}
void printList(struct node *node)
{
    while (node != NULL)
    {
        printf("%d ", node->data);
        node = node->next;
    }
}
int main(void)
{
    struct node* head = NULL;
    // push(&head, 2);
    // push(&head, 4);
    // push(&head, 6);
    // push(&head, 8);
    // push(&head, 10);    
    printf("Given linked list \n");
    printList(head);
    rotate(&head, 1);
    printf("\nRotated Linked list \n");
    printList(head);
    // getch();
}
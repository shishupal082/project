#include <stdio.h>
#include <stdlib.h>
struct node {
     int data;
     struct node* left;
     struct node* right;
};
struct node* newNode(int data) {
     struct node* node = (struct node*) malloc(sizeof(struct node));
     node->data = data;
     node->left = NULL;
     node->right = NULL;
     return node;
}
void push(struct node ** root, int data) {
    if (*root == NULL) {
        struct node * child = newNode(data);
        *root = child;
        return;
    }
    if ((*root)->data > data) {
        push(&(*root)->left, data);
    } else {
        push(&(*root)->right, data);
    }
}
void printInOrder(struct node* root) {
     if (root == NULL)
          return;
     printInOrder(root->left);
     printf("%d ", root->data);  
     printInOrder(root->right);
}
void printPreOrder(struct node* root) {
     if (root == NULL)
          return;
     printf("%d ", root->data);
     printPreOrder(root->left);
     printPreOrder(root->right);
}
void printPostOrder(struct node* root) {
     if (root == NULL)
          return;
     printPostOrder(root->left);
     printPostOrder(root->right);
     printf("%d ", root->data);
}
int main() {
    struct node *root  = NULL;
    push(&root, 2);
    push(&root, 3);
    push(&root, 4);
    push(&root, 5);
    push(&root, 1);
    printf("InOrder traversal of binary tree is \n");
    printInOrder(root);
    printf("\n");
    printf("PreOrder traversal of binary tree is \n");
    printPreOrder(root);
    printf("\n");
    printf("PostOrder traversal of binary tree is \n");
    printPostOrder(root);
    printf("\n");
    return 0;
}

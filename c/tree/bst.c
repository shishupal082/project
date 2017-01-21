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
void printInorder(struct node* root) {
     if (root == NULL)
          return;
     printInorder(root->left);
     printf("%d ", root->data);  
     printInorder(root->right);
}  
int main() {
    struct node *root  = NULL;
    push(&root, 2);
    push(&root, 3);
    push(&root, 4);
    push(&root, 5);
    push(&root, 1);
    printf("Inorder traversal of binary tree is \n");
    printInorder(root);
    printf("\n");
    return 0;
}

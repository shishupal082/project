#include <stdio.h>
int fun(int i) {
    return (i++);
}
void fun2(int *i) {
    (*i)++;
}
int main(){
    int a=10, b=10;
    int i=fun(a);
    fun2(&b);
    printf("%d\n", i); // i=10
    printf("%d\n", --i); // i=9

    printf("%d\n", b); // b=11
    printf("%d\n", --b); // b=10
    return 0;
}
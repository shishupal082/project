#include <stdio.h>
void fun(char *i) {
    printf("1 => %s\n", i); //heelo
    i++;
    printf("2 => %s\n", i); //eelo
    i[1] = 'e';
    printf("3 => %s\n", i); //eelo
}
int main(){
    char s[] = "hello";
    printf("%s\n", s); //hello
    fun(s);
    printf("%s\n", s); //heelo
    printf("%c\n", *s); //h
    return 0;
}
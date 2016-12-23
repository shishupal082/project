#include <stdio.h>

int abc(int ref) {
    printf("%d Come\n", ref);
    return 0;
}
int main(){
    int abc (), abc(); // It will not call the function
    abc(1);
    (*abc)(2);
    printf("\n====End of Programm.====\n");
    return 0;
}

/*
output
-------------
1 Come
2 Come
*/
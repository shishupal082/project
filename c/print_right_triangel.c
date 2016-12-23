#include <stdio.h>
int main(){
    int i,n,j;
    printf("Enter size of triangle : ");
    scanf("%d",&n);
    for(i=1;i<=n;i++){
        for(j=0;j<i;j++){
            printf("0");
        }
        if(i!=n){
            printf("\n");
        }
    }
    printf("\n");
    return 0;
}

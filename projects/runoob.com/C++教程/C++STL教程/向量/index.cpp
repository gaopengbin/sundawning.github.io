#include <cstdio>
#include <vector>
int main()
{
    printf("vector\n");
    std::vector<int> vector;
    for (int i = 0; i < 5; i = i + 1)
    {
        vector.push_back(i);
        printf("push_back %d\n", i);
    }
    printf("vector size = %d\n", vector.size());
    getchar();
}

//файл чисто для меня. не играет никакой роли в текущем проекте

//рекурсивные функции
//факториал

const factorial = (n) => {
    if (n === 1) {
        return 1
    }
    return n * factorial(n - 1)
}

console.log(factorial(5))

//фибоначи
const fibonachi = (n) => {
    if (n === 1 || n === 2) {
        return 1
    }
    return fibonachi(n - 1) + fibonachi(n - 2)
}
console.log(fibonachi(30))


//рекурсивная бинарная сортировка / ток для упорядоченных списков
const arrSort = [0, 1, 2, 3, 4, 5, 6, 7,8, 9, 10, 11, 12, 13]
let countrecursiveBinarySearch = 0 //узнать сколько итераций было
function recursiveBinarySearch(array, item, start, end) {
    let middle = Math.floor((start + end) / 2);
    countrecursiveBinarySearch++
    if (item === array[middle]) {
        return middle
    }
    if (item < array[middle]) {
        return recursiveBinarySearch(array, item, start, middle - 1)
    } else {
        return recursiveBinarySearch(array, item, middle + 1, end)
    }
}
console.log(recursiveBinarySearch(arrSort, 1, 0, arrSort.length))
console.log('количество итераций recursiveBinarySearch', countrecursiveBinarySearch)


//сортировка выбором /неупорядоченный /минималоьный меняем с первым а второй раз минимальный уже меняем со вторым
const arr = [0, 3, 2, 5, 6, 8, 1, 9, 4, 2, 1, 2, 9, 6, 4, 1, 7, 1]
let countSelectionSort = 0 //узнать сколько итераций было
function SelectionSort(array) {
    for (let i = 0; i < array.length; i++) {
        let indexMin = i
        for (let j = i + 1; j < array.length; j++) {
            countSelectionSort++;
            if (array[j] < array[indexMin]) {
                indexMin = j
            }
        }
        let tmp = array[i]
        array[i] = array[indexMin]
        array[indexMin] = tmp
    }
    return array;
}

console.log(SelectionSort(arr))
console.log('количество итераций selecyedsort', countSelectionSort)

// быстрая сортировка /рекурсивный /выбираем центральное разделяем на 2 части с меньшими и большими числами
//быстрее / меньше памяти кушает скорости
let countQuicksort = 0 //узнать сколько итераций было
function QuickSort(array) {
    if (array.length <= 1) {
        return array
    }
    let pivotIndex = Math.floor(array.length / 2);
    let pivot = array[pivotIndex]; //central el
    let less = []
    let greater = []
    for (let i = 0; i < array.length; i++) {
        countQuicksort += 1
        if (i === pivotIndex)
            continue
        if (array[i] < pivot) {
            less.push(array[i])
        } else {
            greater.push(array[i])
        }
    }
    return [...QuickSort(less), pivot, ...QuickSort(greater)]
}

console.log(QuickSort(arr))
console.log('количество итераций квиксорт', countQuicksort)


//работа с графами /найти самый короткий пусть из одной точки в другую
const
    graph = {}
    graph.a = {b: 2,c:1}
    graph.b = {f: 7}
    graph.c = {d: 5,e:2}
    graph.d = {f: 2}
    graph.e = {f: 1}
    graph.f = {g: 1}
    graph.g = {}

function shortPath(graph,start,end){
    const costs ={}
    const processed = []
    let neighbors = {}
    Object.keys(graph).forEach(node => {
        if(node !== start){
            let value = graph[start][node]
            costs[node] = value || 10000000
        }
    })
    let node = findNodeLowestCost(costs,processed)
    while(node){
        const cost = costs[node]
        neighbors = graph[node]
        Object.keys(neighbors).forEach(neighbor => {
            let newCost = cost + neighbors[neighbor]
            if(newCost< costs [neighbor]){
                costs[neighbor] = newCost
            }
        })
        processed.push(node)
        node = findNodeLowestCost(costs, processed)
    }
    return costs
}

function findNodeLowestCost(costs, processed) {
    let lowestCost = 1000000
    let lowestNode;
    Object.keys(costs).forEach(node => {
        let cost = costs[node]
        if(cost<lowestCost && !processed.includes(node)){
            lowestNode = cost
            lowestNode = node
        }
    })
    return lowestNode
}
console.log(shortPath(graph, 'a','g'))

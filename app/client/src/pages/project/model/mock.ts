import { Column, Task } from "shared/api";

export const mockTasks: Task[] = [
    {
        id: 1,
        columnId: 1,
        completed: false,
        text: '1',
        order: 0,
    },
    {
        id: 2,
        columnId: 1,
        completed: false,
        text: '2',
        order: 1,
    },
    {
        id: 3,
        columnId: 2,
        completed: false,
        text: '3',
        order: 2,
    },
    {
        id: 4,
        columnId: 2,
        completed: false,
        text: '4',
        order: 3,
    },
    {
        id: 5,
        columnId: 3,
        completed: false,
        text: '5',
        order: 4,
    },
    {
        id: 6,
        columnId: 3,
        completed: false,
        text: '6',
        order: 5,
    },
    {
        id: 7,
        columnId: 4,
        completed: false,
        text: '7',
        order: 6,
    },
    {
        id: 8,
        columnId: 4,
        completed: false,
        text: '8',
        order: 7,
    }
]

export const mockColumns: Column[] = [
    {
        id: 2,
        projectId: 1,
        name: 'B',
        order: 1,
    },
    {
        id: 1,
        projectId: 1,
        name: 'A',
        order: 0,
    },
    {
        id: 3,
        projectId: 1,
        name: 'C',
        order: 2,
    },
    {
        id: 4,
        projectId: 1,
        name: 'D',
        order: 3,
    },
    {
        id: 5,
        projectId: 1,
        name: 'E',
        order: 4,
    },
    {
        id: 6,
        projectId: 1,
        name: 'F',
        order: 5,
    },
]

// export const mockData = [
//     {
//         id: 2,
//         projectId: 1,
//         name: 'B',
//         order: 1,
//         tasks: [ 
//             {
//                 id: 3,
//                 columnId: 2,
//                 completed: false,
//                 text: '3',
//                 order: 0,
//             },
//             {
//                 id: 4,
//                 columnId: 2,
//                 completed: false,
//                 text: '4',
//                 order: 1,
//             },
            
//         ]
//     },
//     {
//         id: 1,
//         projectId: 1,
//         name: 'A',
//         order: 0,
//         tasks: [
//            {
//                 id: 1,
//                 columnId: 1,
//                 completed: false,
//                 text: '1',
//                 order: 0,
//             },
//             {
//                 id: 2,
//                 columnId: 1,
//                 completed: false,
//                 text: '2',
//                 order: 1,
//             },
//         ]
//     },
//     {
//         id: 3,
//         projectId: 1,
//         name: 'C',
//         order: 2,
//         tasks: [
//             {
//                 id: 5,
//                 columnId: 3,
//                 completed: false,
//                 text: '5',
//                 order: 0,
//             },
//             {
//                 id: 6,
//                 columnId: 3,
//                 completed: false,
//                 text: '6',
//                 order: 1,
//             },
//         ]
//     },
//     {
//         id: 4,
//         projectId: 1,
//         name: 'D',
//         order: 3,
//         tasks: [
//             {
//                 id: 7,
//                 columnId: 4,
//                 completed: false,
//                 text: '7',
//                 order: 0,
//             },
//             {
//                 id: 8,
//                 columnId: 4,
//                 completed: false,
//                 text: '8',
//                 order: 1,
//             }
//         ]
//     },
// ]
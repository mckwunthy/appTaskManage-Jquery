/*dans ce fichier nous eclatons toutes les methodes de la class necessaires pour notre programme*/
/*ensuite nous exportons ces methodes pour les rendre accessibles dans d'autres fichiers*/
/*la ligne 7 : nous creons notre bdd database nommee taskdb avec une table task*/


const database = new LocalDatabase('taskdb', ['task'], 1)

const addTask = async (taskData) => {
    await database.addData('task', taskData)
}

const updatedTask = async (taskData) => {
    await database.updateData('task', taskData)
}

const getAllTask = async () => {
    return await database.getAllData('task')
}

const getTask = async (key) => {
    return await database.getData('task', key)
}

const deleteTask = async (key) => {
    await database.deleteData('task', key)
}



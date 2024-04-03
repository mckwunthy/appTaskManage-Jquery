/*gestion des stockage dans indexDB : sauvegarde, suppression, modification, receuil*/
class LocalDatabase {

    constructor(dbName, objectNames, dbVersion = 1) {
        this.dbName = dbName
        this.objectNames = objectNames
        this.dbVersion = dbVersion

        this.dbPromise = this.openDatabase()
    }

    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName, this.dbVersion)
            request.onupgradeneeded = (event) => {
                let db = event.target.result
                if (this.objectNames.length) {
                    this.objectNames.forEach(tableName => {
                        if (!db.objectStoreNames.contains(tableName)) {
                            db.createObjectStore(tableName, {
                                keyPath: '_id',
                                autoIncrement: true
                            })
                        }
                    });
                }
            }
            request.onsuccess = (event) => {
                this.db = event.target.result
                resolve(this.db)
            }
            request.onerror = (event) => {
                const error = event.target.error
                reject("Error when opening database :", error);
            }
        })
    }

    async addData(dbTable, data) {
        if (!this.db) {
            this.db = await this.dbPromise
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(dbTable, 'readwrite');
            const objectStore = transaction.objectStore(dbTable);

            objectStore.add(data);


            transaction.oncomplete = () => {
                resolve('Data added successfully');
            }

            transaction.onerror = (event) => {
                reject('Error adding data:', event.target.errorCode);
            }
        })
    }
    async updateData(dbTable, data) {
        if (!this.db) {
            this.db = await this.dbPromise
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(dbTable, 'readwrite');
            const objectStore = transaction.objectStore(dbTable);

            objectStore.put(data);

            transaction.oncomplete = () => {
                resolve('Data updated successfully');
            }

            transaction.onerror = (event) => {
                reject('Error updating data:', event.target.errorCode);
            }
        });
    }

    async getData(dbTable, key) {
        if (!this.db) {
            this.db = await this.dbPromise
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(dbTable, 'readonly');
            const objectStore = transaction.objectStore(dbTable);

            const request = objectStore.get(key);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            }

            request.onerror = (event) => {
                reject('Error getting data:', event.target.errorCode);
            }
        });
    }

    async getAllData(dbTable) {
        if (!this.db) {
            this.db = await this.dbPromise
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(dbTable, 'readonly');
            const objectStore = transaction.objectStore(dbTable);

            const request = objectStore.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            }

            request.onerror = (event) => {
                reject('Error getting all data:', event.target.errorCode);
            }
        });
    }

    async deleteData(dbTable, key) {
        if (!this.db) {
            this.db = await this.dbPromise
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(dbTable, 'readwrite');
            const objectStore = transaction.objectStore(dbTable);

            const request = objectStore.delete(key);

            transaction.oncomplete = () => {
                resolve('Data deleted successfully');
            }

            transaction.onerror = (event) => {
                reject('Error deleting data:', event.target.errorCode);
            }
        });
    }
}
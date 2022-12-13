import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from '../models/Book.model';
import {getDatabase, ref, set, onValue, get} from 'firebase/database'
import * as firebaseStorage from 'firebase/storage'

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private books: Book[] = []
  booksSubject = new Subject<Book[]>()
  booksRef = ref(getDatabase(), '/books') //Référence de l'emplacement où on stocke les livres

  constructor() { }

  emitBooks(){
    this.booksSubject.next(this.books)
  }

  getLastBookId(){
    let max = this.books.length - 1
    if(max===-1) return 0   // Si le tableau est vide...
    else{
      return this.books[max].id
    }
  }

  saveBooks(){ //console.log(this.booksRef)
    set(this.booksRef, this.books)
  }

  getBooks(){
    onValue(this.booksRef, (snapshot) => {
      const data = snapshot.val();
      this.books = data ? data : []
      this.emitBooks()
    });
  }

  getSingleBook(id: number){
    return new Promise((resolve, reject)=>{

      get(ref(getDatabase(), '/books/' + id)).then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        reject(error);
      });
    })
  }

  createNewBook(newBook: Book){
    this.books.push(newBook)
    this.saveBooks()
    this.emitBooks()
  }

  updateBook(a_book: Book){
    let index = this.books.findIndex((value)=> value.id === a_book.id)
    if(index===-1) return
    
    this.books[index] = a_book
    this.saveBooks()
    this.emitBooks()
  }

  removeBook(a_book: Book){
    if(a_book.photo){
      const storage = firebaseStorage.getStorage()
      const storageRef = firebaseStorage.ref(storage, a_book.photo)

      // Suppression de la photo du livre
      firebaseStorage.deleteObject(storageRef).then(() => {
        console.log('Photo supprimée')
      }).catch((error) => {
        console.log('Echec lors de la suppression de la photo:', error)
      });
    }

    let index = this.books.findIndex((value)=> value.id === a_book.id)
    if(index===-1) return

    this.books.splice(index, 1) //Retire l'élément à l'indice demandé
    this.saveBooks()
    this.emitBooks()
  }

  uploadFile(file: File){
    return new Promise<string>((resolve, reject)=>{
      const uniqueFileName = Date.now().toString() + file.name
      const storage = firebaseStorage.getStorage()
      const storageRef = firebaseStorage.ref(storage, 'images/' + uniqueFileName)

      // firebaseStorage.uploadBytes(storageRef, file)
      //   .then((snapshot)=>{
      //     resolve(snapshot)
      //   })
      //   .catch((error)=>{
      //     reject(error)
      //   })

      const uploadTask = firebaseStorage.uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload en pause');
                break
              case 'running':
                console.log('Upload en cours...');
                break
            }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            console.log('Erreur lors de l\'upload:', error)
            reject()
          }, 
          () => {
            // Handle successful uploads on complete
            firebaseStorage.getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  resolve(downloadURL)
                })
          }
        )

    })
  }
}

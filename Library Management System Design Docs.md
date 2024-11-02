# Mulyono's Library System Design

- Changelog:
	- Initial Document - @indrafrds on 31 Oct 2024

You can render UML diagrams using [Mermaid](https://mermaid.live/edit).

## Usecase Diagram

```mermaid
stateDiagram
    state "Library Management System" as LMS {
        state "Book Management" as BM {
            [*] --> ViewBooksList
            [*] --> ViewBookDetail
            [*] --> AddNewBook
            [*] --> UpdateBook
            [*] --> DeleteBook
            [*] --> UploadBookCover
        }
        
        state "Author Management" as AM {
            [*] --> ViewAuthorsList
            [*] --> ViewAuthorDetail
            [*] --> AddNewAuthor
            [*] --> UpdateAuthor
            [*] --> DeleteAuthor
            [*] --> UploadAuthorPhoto
        }
        
        state "Category Management" as CM {
            [*] --> ViewCategoriesList
            [*] --> ViewCategoryDetail
            [*] --> AddNewCategory
            [*] --> UpdateCategory
            [*] --> DeleteCategory
        }
        
        state "Borrower Management" as BRM {
            [*] --> ViewBorrowersList
            [*] --> ViewBorrowerDetail
            [*] --> AddNewBorrower
            [*] --> UpdateBorrower
            [*] --> DeleteBorrower
        }
        
        state "Book Borrowing" as BB {
            [*] --> CreateBookBorrowing
            [*] --> ViewActiveBorrowings
            [*] --> ProcessBookReturn
            ProcessBookReturn --> CalculateFees
        }
    }
```

## Sequence Diagrams

### 1. Book Management
```mermaid
sequenceDiagram
    actor Client
    participant API
    participant BookController
    participant BookModel
    participant Database
    participant FileStorage

    %% GET /books
    Client->>API: GET /books
    API->>BookController: getBooks()
    BookController->>BookModel: find()
    BookModel->>Database: query
    Database-->>BookModel: books data
    BookModel-->>BookController: books array
    BookController-->>API: JSON response
    API-->>Client: 200 OK + books list

    %% GET /book/:id
    Client->>API: GET /book/:id
    API->>BookController: getBook(id)
    BookController->>BookModel: findById(id)
    BookModel->>Database: query
    Database-->>BookModel: book data
    BookModel-->>BookController: book details
    BookController-->>API: JSON response
    API-->>Client: 200 OK + book details

    %% POST /book
    Client->>API: POST /book
    API->>BookController: createBook(bookData)
    BookController->>BookModel: create(bookData)
    BookModel->>Database: insert
    Database-->>BookModel: confirmation
    BookModel-->>BookController: new book
    BookController-->>API: JSON response
    API-->>Client: 201 Created + book data

    %% PUT /book/:id
    Client->>API: PUT /book/:id
    API->>BookController: updateBook(id, bookData)
    BookController->>BookModel: findByIdAndUpdate(id, bookData)
    BookModel->>Database: update
    Database-->>BookModel: confirmation
    BookModel-->>BookController: updated book
    BookController-->>API: JSON response
    API-->>Client: 200 OK + updated data

    %% DELETE /book/:id
    Client->>API: DELETE /book/:id
    API->>BookController: deleteBook(id)
    BookController->>BookModel: findByIdAndDelete(id)
    BookModel->>Database: delete
    Database-->>BookModel: confirmation
    BookModel-->>BookController: deletion status
    BookController-->>API: JSON response
    API-->>Client: 200 OK

    %% POST /book/upload
    Client->>API: POST /book/upload
    API->>BookController: uploadCover(file)
    BookController->>FileStorage: storeFile(file)
    FileStorage-->>BookController: fileUrl
    BookController->>BookModel: updateCover(bookId, coverUrl)
    BookModel->>Database: update
    Database-->>BookModel: confirmation
    BookModel-->>BookController: updated book
    BookController-->>API: JSON response
    API-->>Client: 200 OK + cover URL
```

### 2. Category Management

```mermaid
sequenceDiagram
    actor Client
    participant API
    participant CategoryController
    participant CategoryModel
    participant Database

    %% GET /categories
    Client->>API: GET /categories
    API->>CategoryController: getCategories()
    CategoryController->>CategoryModel: find()
    CategoryModel->>Database: query
    Database-->>CategoryModel: categories data
    CategoryModel-->>CategoryController: categories array
    CategoryController-->>API: JSON response
    API-->>Client: 200 OK + categories list

    %% GET /category/:id
    Client->>API: GET /category/:id
    API->>CategoryController: getCategory(id)
    CategoryController->>CategoryModel: findById(id)
    CategoryModel->>Database: query
    Database-->>CategoryModel: category data
    CategoryModel-->>CategoryController: category details
    CategoryController-->>API: JSON response
    API-->>Client: 200 OK + category details

    %% POST /category
    Client->>API: POST /category
    API->>CategoryController: createCategory(categoryData)
    CategoryController->>CategoryModel: create(categoryData)
    CategoryModel->>Database: insert
    Database-->>CategoryModel: confirmation
    CategoryModel-->>CategoryController: new category
    CategoryController-->>API: JSON response
    API-->>Client: 201 Created + category data

    %% PUT /category/:id
    Client->>API: PUT /category/:id
    API->>CategoryController: updateCategory(id, categoryData)
    CategoryController->>CategoryModel: findByIdAndUpdate(id, categoryData)
    CategoryModel->>Database: update
    Database-->>CategoryModel: confirmation
    CategoryModel-->>CategoryController: updated category
    CategoryController-->>API: JSON response
    API-->>Client: 200 OK + updated data

    %% DELETE /category/:id
    Client->>API: DELETE /category/:id
    API->>CategoryController: deleteCategory(id)
    CategoryController->>CategoryModel: findByIdAndDelete(id)
    CategoryModel->>Database: delete
    Database-->>CategoryModel: confirmation
    CategoryModel-->>CategoryController: deletion status
    CategoryController-->>API: JSON response
    API-->>Client: 200 OK
```

### 3. Author Management

```mermaid
sequenceDiagram
    actor Client
    participant API
    participant AuthorController
    participant AuthorModel
    participant FileStorage
    participant Database

    %% GET /authors
    Client->>API: GET /authors
    API->>AuthorController: getAuthors()
    AuthorController->>AuthorModel: find()
    AuthorModel->>Database: query
    Database-->>AuthorModel: authors data
    AuthorModel-->>AuthorController: authors array
    AuthorController-->>API: JSON response
    API-->>Client: 200 OK + authors list

    %% GET /author/:id
    Client->>API: GET /author/:id
    API->>AuthorController: getAuthor(id)
    AuthorController->>AuthorModel: findById(id)
    AuthorModel->>Database: query
    Database-->>AuthorModel: author data
    AuthorModel-->>AuthorController: author details
    AuthorController-->>API: JSON response
    API-->>Client: 200 OK + author details

    %% POST /author
    Client->>API: POST /author
    Note right of Client: {name, bio, birthDate, etc.}
    API->>AuthorController: createAuthor(authorData)
    AuthorController->>AuthorModel: create(authorData)
    AuthorModel->>Database: insert
    Database-->>AuthorModel: confirmation
    AuthorModel-->>AuthorController: new author
    AuthorController-->>API: JSON response
    API-->>Client: 201 Created + author data

    %% PUT /author/:id
    Client->>API: PUT /author/:id
    Note right of Client: {name, bio, birthDate, etc.}
    API->>AuthorController: updateAuthor(id, authorData)
    AuthorController->>AuthorModel: findByIdAndUpdate(id, authorData)
    AuthorModel->>Database: update
    Database-->>AuthorModel: confirmation
    AuthorModel-->>AuthorController: updated author
    AuthorController-->>API: JSON response
    API-->>Client: 200 OK + updated data

    %% DELETE /author/:id
    Client->>API: DELETE /author/:id
    API->>AuthorController: deleteAuthor(id)
    AuthorController->>AuthorModel: findByIdAndDelete(id)
    AuthorModel->>Database: delete
    Database-->>AuthorModel: confirmation
    AuthorModel-->>AuthorController: deletion status
    AuthorController-->>API: JSON response
    API-->>Client: 200 OK

    %% POST /author/upload
    Client->>API: POST /author/upload
    Note right of Client: FormData with photo file
    API->>AuthorController: uploadPhoto(file)
    AuthorController->>FileStorage: storeFile(file)
    FileStorage-->>AuthorController: fileUrl
    AuthorController->>AuthorModel: updatePhoto(authorId, photoUrl)
    AuthorModel->>Database: update
    Database-->>AuthorModel: confirmation
    AuthorModel-->>AuthorController: updated author
    AuthorController-->>API: JSON response
    API-->>Client: 200 OK + photo URL
```

### 4. Borrower Management

```mermaid
sequenceDiagram
    actor Client
    participant API
    participant BorrowerController
    participant BorrowerModel
    participant Database

    %% GET /borrowers
    Client->>API: GET /borrowers
    API->>BorrowerController: getBorrowers()
    BorrowerController->>BorrowerModel: find()
    BorrowerModel->>Database: query
    Database-->>BorrowerModel: borrowers data
    BorrowerModel-->>BorrowerController: borrowers array
    BorrowerController-->>API: JSON response
    API-->>Client: 200 OK + borrowers list

    %% GET /borrower/:id
    Client->>API: GET /borrower/:id
    API->>BorrowerController: getBorrower(id)
    BorrowerController->>BorrowerModel: findById(id)
    BorrowerModel->>Database: query
    Database-->>BorrowerModel: borrower data
    BorrowerModel-->>BorrowerController: borrower details
    BorrowerController-->>API: JSON response
    API-->>Client: 200 OK + borrower details

    %% POST /borrower
    Client->>API: POST /borrower
    Note right of Client: {name, email, phone, address, membershipId}
    API->>BorrowerController: createBorrower(borrowerData)
    BorrowerController->>BorrowerModel: create(borrowerData)
    BorrowerModel->>Database: insert
    Database-->>BorrowerModel: confirmation
    BorrowerModel-->>BorrowerController: new borrower
    BorrowerController-->>API: JSON response
    API-->>Client: 201 Created + borrower data

    %% PUT /borrower/:id
    Client->>API: PUT /borrower/:id
    Note right of Client: {name, email, phone, address, membershipId}
    API->>BorrowerController: updateBorrower(id, borrowerData)
    BorrowerController->>BorrowerModel: findByIdAndUpdate(id, borrowerData)
    BorrowerModel->>Database: update
    Database-->>BorrowerModel: confirmation
    BorrowerModel-->>BorrowerController: updated borrower
    BorrowerController-->>API: JSON response
    API-->>Client: 200 OK + updated data

    %% DELETE /borrower/:id
    Client->>API: DELETE /borrower/:id
    API->>BorrowerController: deleteBorrower(id)
    BorrowerController->>BorrowerModel: findByIdAndDelete(id)
    BorrowerModel->>Database: delete
    Database-->>BorrowerModel: confirmation
    BorrowerModel-->>BorrowerController: deletion status
    BorrowerController-->>API: JSON response
    API-->>Client: 200 OK
```

### 5. Borrowing Management

```mermaid
sequenceDiagram
    actor Client
    participant API
    participant BorrowController
    participant BorrowModel
    participant BookModel
    participant Database

    %% POST /borrow/book
    Client->>API: POST /borrow/book
    API->>BorrowController: createBorrow(borrowData)
    BorrowController->>BookModel: checkAvailability(bookId)
    BookModel->>Database: query
    Database-->>BookModel: book status
    BookModel-->>BorrowController: availability
    BorrowController->>BorrowModel: create(borrowData)
    BorrowModel->>Database: insert
    Database-->>BorrowModel: confirmation
    BorrowModel-->>BorrowController: borrow record
    BorrowController-->>API: JSON response
    API-->>Client: 201 Created

    %% GET /borrow/book/list
    Client->>API: GET /borrow/book/list
    API->>BorrowController: getActiveBorrows()
    BorrowController->>BorrowModel: findActive()
    BorrowModel->>Database: query
    Database-->>BorrowModel: active borrows
    BorrowModel-->>BorrowController: active borrow list
    BorrowController-->>API: JSON response
    API-->>Client: 200 OK + active borrows

    %% POST /borrow/book/return
    Client->>API: POST /borrow/book/return
    API->>BorrowController: returnBook(returnData)
    BorrowController->>BorrowModel: getBorrow(borrowId)
    BorrowModel->>Database: query
    Database-->>BorrowModel: borrow data
    BorrowModel-->>BorrowController: borrow details
    BorrowController->>BorrowController: calculateLateFees()
    BorrowController->>BorrowModel: update(returnData)
    BorrowModel->>Database: update
    Database-->>BorrowModel: confirmation
    BorrowModel-->>BorrowController: updated record
    BorrowController-->>API: JSON response
    API-->>Client: 200 OK + return details
```

## Detailed Logic for Borrowing and Returning

### 1. Borrowing Process Flowchart

```mermaid
flowchart TD
    Start([Start Borrowing Process]) --> ValidateInput[Validate Input Data]
    ValidateInput --> CheckInput{Input Valid?}
    
    CheckInput -->|No| ReturnError1[Return Validation Error]
    ReturnError1 --> End1([End])
    
    CheckInput -->|Yes| StartTx[Start Database Transaction]
    StartTx --> CheckBook{Check Book Exists}
    
    CheckBook -->|No| AbortTx1[Abort Transaction]
    AbortTx1 --> ReturnError2[Return Book Not Found Error]
    ReturnError2 --> End2([End])
    
    CheckBook -->|Yes| CheckStock{Check Stock Quantity}
    
    CheckStock -->|Not Available| AbortTx3[Abort Transaction]
    AbortTx3 --> ReturnError4[Return Out of Stock Error]
    ReturnError4 --> End4([End])
    
    CheckStock -->|Available| CreateBorrow[Create Borrow Record]
    CreateBorrow --> UpdateStock[Decrement Available Stock]
    UpdateStock --> CreateLog[Create Stock Log]
    CreateLog --> CommitTx[Commit Transaction]
    CommitTx --> ReturnSuccess[Return Success Response]
    ReturnSuccess --> End6([End])
```

### 2. Returning Process Flowchart

```mermaid
flowchart TD
    Start([Start Return Process]) --> ValidateInput[Validate Return Data]
    ValidateInput --> CheckInput{Input Valid?}
    
    CheckInput -->|No| ReturnError1[Return Validation Error]
    ReturnError1 --> End1([End])
    
    CheckInput -->|Yes| StartTx[Start Database Transaction]
    StartTx --> CheckBorrow{Check Borrow Record}
    
    CheckBorrow -->|Not Found| AbortTx1[Abort Transaction]
    AbortTx1 --> ReturnError2[Return Borrow Not Found Error]
    ReturnError2 --> End2([End])
    
    CheckBorrow -->|Found| CalculateFee[Calculate Late Fee]
    CalculateFee --> UpdateBorrow[Update Borrow Status]
    UpdateBorrow --> UpdateStock[Increment Available Stock]
    UpdateStock --> CreateLog[Create Stock Log]
    CreateLog --> CommitTx[Commit Transaction]
    CommitTx --> ReturnSuccess[Return Success Response]
    ReturnSuccess --> End4([End])
```

### 3. Sequence Diagram for Borrowing and Returning Process

```mermaid
sequenceDiagram
    participant C as Client
    participant API
    participant BC as BorrowController
    participant BS as BookService
    participant SS as StockService
    participant BM as BorrowModel
    participant SM as StockModel
    participant SL as StockLog
    participant DB as Database

    %% Borrow Process
    Note over C,DB: Borrow Process
    C->>API: POST /borrow/book
    API->>BC: borrowBook(data)
    
    BC->>BS: checkBookExists(bookId)
    BS->>DB: query
    DB-->>BS: book data
    BS-->>BC: book exists
    
    BC->>SS: checkStockAvailable(bookId)
    SS->>DB: query
    DB-->>SS: stock data
    SS-->>BC: stock available
    
    BC->>BM: createBorrow(borrowData)
    BM->>DB: insert
    DB-->>BM: confirmation
    
    BC->>SS: decrementStock(bookId)
    SS->>SM: updateStock(-1)
    SM->>DB: update
    DB-->>SM: confirmation
    
    BC->>SL: createLog("BORROW")
    SL->>DB: insert
    DB-->>SL: confirmation
    
    BC-->>API: success response
    API-->>C: 201 Created

    %% Return Process
    Note over C,DB: Return Process
    C->>API: POST /borrow/book/return
    API->>BC: returnBook(data)
    
    BC->>BM: checkBorrowExists(borrowId)
    BM->>DB: query
    DB-->>BM: borrow data
    BM-->>BC: borrow exists
    
    BC->>BC: calculateLateFee()
    
    BC->>BM: updateBorrowStatus(borrowId)
    BM->>DB: update
    DB-->>BM: confirmation
    
    BC->>SS: incrementStock(bookId)
    SS->>SM: updateStock(+1)
    SM->>DB: update
    DB-->>SM: confirmation
    
    BC->>SL: createLog("RETURN")
    SL->>DB: insert
    DB-->>SL: confirmation
    
    BC-->>API: success response
    API-->>C: 200 OK
```

## Entity Relationship Diagram and MongoDB Collection Schema

### 1. ER Diagram
```mermaid
erDiagram
    BOOKS ||--o{ BOOK_STOCKS : has
    BOOKS }o--|| CATEGORIES : belongs_to
    BOOKS }o--|| AUTHORS : written_by
    BOOKS ||--o{ BORROWINGS : included_in
    BORROWERS ||--o{ BORROWINGS : makes
    BOOK_STOCKS ||--o{ STOCK_LOGS : tracks

    BOOKS {
        ObjectId _id
        String title
        String description
        String isbn
        String coverUrl
        Number totalPages
        ObjectId categoryId
        ObjectId authorId
        Date publishedDate
        String publisher
        String language
        Date createdAt
        Date updatedAt
    }

    AUTHORS {
        ObjectId _id
        String name
        String bio
        Date birthDate
        String photoUrl
        Array books
        Date createdAt
        Date updatedAt
    }

    CATEGORIES {
        ObjectId _id
        String name
        String description
        Date createdAt
        Date updatedAt
    }

    BORROWERS {
        ObjectId _id
        String membershipId
        String name
        String email
        String phone
        String address
        String status
        Array borrowHistory
        Date createdAt
        Date updatedAt
    }

    BORROWINGS {
        ObjectId _id
        ObjectId bookId
        ObjectId borrowerId
        Date borrowDate
        Date dueDate
        Date returnDate
        Number lateFee
        String status
        Date createdAt
        Date updatedAt
    }

    BOOK_STOCKS {
        ObjectId _id
        ObjectId bookId
        Number totalQuantity
        Number availableQuantity
        Number borrowedQuantity
        Date lastUpdated
        Date createdAt
        Date updatedAt
    }

    STOCK_LOGS {
        ObjectId _id
        ObjectId bookId
        ObjectId bookStockId
        String action
        Number quantity
        String reason
        ObjectId referenceId
        Date createdAt
    }

```

### 2. MongoDB Collection Schema

#### Books Collection
```javascript
{
    _id: ObjectId,
    title: String,
    description: String,
    isbn: String,
    coverUrl: String,
    totalPages: Number,
    categoryId: ObjectId,  // Reference to CATEGORIES
    authorId: ObjectId,    // Reference to AUTHORS
    publishedDate: Date,
    publisher: String,
    language: String,
    createdAt: Date,
    updatedAt: Date
}
```

#### Authors Collection
```javascript
{
    _id: ObjectId,
    name: String,
    bio: String,
    birthDate: Date,
    photoUrl: String,
    books: [ObjectId],     // Array of book references
    createdAt: Date,
    updatedAt: Date
}
```

#### Categories Collection
```javascript
{
    _id: ObjectId,
    name: String,
    description: String,
    createdAt: Date,
    updatedAt: Date
}
```

#### Borrowers Collection
```javascript
{
    _id: ObjectId,
    membershipId: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    status: String,        // Active/Inactive
    borrowHistory: [ObjectId], // Array of borrowing references
    createdAt: Date,
    updatedAt: Date
}
```

#### Borrowings Collection
```javascript
{
    _id: ObjectId,
    bookId: ObjectId,      // Reference to BOOKS
    borrowerId: ObjectId,  // Reference to BORROWERS
    borrowDate: Date,
    dueDate: Date,
    returnDate: Date,
    lateFee: Number,
    status: String,        // Active/Returned/Overdue
    createdAt: Date,
    updatedAt: Date
}
```

#### Book Stocks Collection
```javascript
{
    _id: ObjectId,
    bookId: ObjectId,      // Reference to BOOKS
    totalQuantity: Number,
    availableQuantity: Number,
    borrowedQuantity: Number,
    lastUpdated: Date,
    createdAt: Date,
    updatedAt: Date
}
```

#### Stock Logs Collection
```javascript
{
    _id: ObjectId,
    bookId: ObjectId,      // Reference to BOOKS
    bookStockId: ObjectId, // Reference to BOOK_STOCKS
    action: String,        // Add/Remove/Borrow/Return
    quantity: Number,
    reason: String,
    referenceId: ObjectId, // Could reference BORROWINGS or other documents
    createdAt: Date
}
```

## Relationships

1.  Books → Categories: Many-to-One
2.  Books → Authors: Many-to-One
3.  Books → Book Stocks: One-to-One
4.  Books → Borrowings: One-to-Many
5.  Borrowers → Borrowings: One-to-Many
6.  Book Stocks → Stock Logs: One-to-Many
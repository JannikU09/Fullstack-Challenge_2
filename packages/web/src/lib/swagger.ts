export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Fullstack Challenge API",
    description: "API für die Buchverwaltungs-App",
    version: "1.0.0",
  },
  paths: {
    "/api/authors": {
      get: {
        summary: "Alle Autoren abrufen",
        description: "Gibt eine Liste aller Autoren aus der Datenbank zurück.",
        operationId: "getAuthors",
        responses: {
          "200": {
            description: "Liste der Autoren",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Author" },
                },
              },
            },
          },
        },
      },
    },
    "/api/books": {
      get: {
        summary: "Alle Bücher abrufen",
        description: "Gibt eine Liste aller Bücher mit ihren Autoren zurück.",
        operationId: "getBooks",
        responses: {
          "200": {
            description: "Liste der Bücher",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/BookWithAuthor" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Neues Buch erstellen",
        description: "Erstellt ein neues Buch in der Datenbank.",
        operationId: "createBook",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBookInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Erstelltes Buch",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookWithAuthor" },
              },
            },
          },
          "400": {
            description: "Ungültige Eingabe",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/books/{id}": {
      get: {
        summary: "Ein Buch abrufen",
        description: "Gibt ein einzelnes Buch anhand seiner ID zurück.",
        operationId: "getBook",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Die ID des Buches",
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Das gesuchte Buch",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookWithAuthor" },
              },
            },
          },
          "404": {
            description: "Buch nicht gefunden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        summary: "Buch aktualisieren (Bonus)",
        description: "Aktualisiert ein bestehendes Buch anhand seiner ID.",
        operationId: "updateBook",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Die ID des Buches",
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateBookInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Aktualisiertes Buch",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookWithAuthor" },
              },
            },
          },
          "404": {
            description: "Buch nicht gefunden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Buch löschen",
        description: "Löscht ein Buch anhand seiner ID aus der Datenbank.",
        operationId: "deleteBook",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Die ID des Buches",
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": {
            description: "Buch erfolgreich gelöscht",
          },
          "404": {
            description: "Buch nicht gefunden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Author: {
        type: "object",
        properties: {
          id: { type: "integer", description: "Eindeutige ID des Autors" },
          name: { type: "string", description: "Name des Autors" },
        },
        required: ["id", "name"],
      },
      Book: {
        type: "object",
        properties: {
          id: { type: "integer", description: "Eindeutige ID des Buches" },
          title: { type: "string", description: "Titel des Buches" },
          isbn: {
            type: "string",
            nullable: true,
            description: "ISBN-Nummer des Buches",
          },
          year: {
            type: "integer",
            nullable: true,
            description: "Erscheinungsjahr des Buches",
          },
          authorId: { type: "integer", description: "ID des Autors" },
        },
        required: ["id", "title", "authorId"],
      },
      BookWithAuthor: {
        allOf: [
          { $ref: "#/components/schemas/Book" },
          {
            type: "object",
            properties: {
              author: { $ref: "#/components/schemas/Author" },
            },
            required: ["author"],
          },
        ],
        description: "Buch mit eingebettetem Autor-Objekt",
      },
      CreateBookInput: {
        type: "object",
        properties: {
          title: { type: "string", description: "Titel des Buches" },
          authorId: { type: "integer", description: "ID des Autors" },
          isbn: {
            type: "string",
            description: "ISBN-Nummer des Buches (optional)",
          },
          year: {
            type: "integer",
            description: "Erscheinungsjahr des Buches (optional)",
          },
        },
        required: ["title", "authorId"],
      },
      UpdateBookInput: {
        type: "object",
        properties: {
          title: { type: "string", description: "Neuer Titel des Buches" },
          authorId: { type: "integer", description: "Neue Autor-ID" },
          isbn: { type: "string", description: "Neue ISBN-Nummer" },
          year: { type: "integer", description: "Neues Erscheinungsjahr" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", description: "Fehlermeldung" },
        },
        required: ["error"],
      },
    },
  },
};

# OnePlace

## Descrizione

Questa WebApp mette a disposizione agli utenti un area dove poter condividere file e cartelle, ed editare in collaborazione un file.
Il codice sorgente è suddiviso in 2 progetti, uno dedicato per il backend, e l'altro per il frontend.

### Frontend

Per il Frontend è stato scelto l'utilizzo di NextJS, con l'ausilio della libreria grafica Flowbite. Inoltre per la gestione delle cartelle sono state utilizzate componenti ad albero della libreria PrimeReact.

### Backend

Per il Backend è stato scelto l'utilizzo di NestJS, con l'utilizzo di plugin come Gateway (implementazione di socket.io per NestJS)

## Installazione

Bisogna installare le dipendenze, prima assiicurarsi di aver installato PNPM

```
pnpm install
```

Dopodiché, nelle rispettive directory apps/, ovvero sia per il backend/ che per la webapp/, bisogna configurare opportunamente il file di enviroment. Necessaria la configurazione con Auth0, che necessita di essere configurata manualmente presso l'apposito sito.

## Configurazione

Dopo aver configurato il tentant su Auth0, bisogna configurarlo con i rispettivi attributi di configurazione presenti nel .env file di esempio. Gli .env file devono essere configurati sia per il frontend sia per il backend

## Utilizzo

Di seguito vengono riportati tutti i passaggi da eseguire per poter avviare il progetto in locale.
Se non si ha un ambiente di sviluppo con database, è possibile avviare l'immagine Docker con:

```
docker compose up -d
```

Si può avviare il server, backend e frontend, con:

```
pnpm run dev
```

Se vengono modificati, aggiunti, o eliminati controller, con la opportuna modifica di attributi della swagger interface, allora bisogna anche aggiornare il client frontend con:

```
pnpm run codegen
```

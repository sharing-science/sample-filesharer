# Sample File Sharer
A POC by Noe Horowitz

Walkthrough tutorial video:
https://rpi.box.com/s/gieyjk3pvzyg8yu7a9hfgc3a9sqf8lgs

## Installation

There are two main parts to this application, the Backend and the Client, each with its own necessary packages.

All of these commands assume that you are starting in the root directory.

#### Backend

The Backend is mainly used as a database, it is built with Python [Flask](https://flask.palletsprojects.com/en/2.0.x/)

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the backend for this POC.

```bash
> cd .\backend\

-- Optional: creating a virtual python environment --
> python -m venv venv
> venv\Scripts\activate.bat
-----------------------------------------------------

> pip install -r requirements.txt
```
#### Client

The Client is the front end of the application, this is where most of the application lies. It is built using [React](https://reactjs.org/).

```bash
> cd .\client\
> npm install
```

## Usage

#### Backend

Running the backend works as follows:

```bash
> cd .\backend\

-- If using virtual environment --
> venv\Scripts\activate.bat
----------------------------------

> flask run
```

This will make the backend run, on the first instance, the [SQLAlchemy](https://www.sqlalchemy.org/) Database is automatically created under the file database.db.


#### Client

Running the client works as follows:

```bash
> cd .\client\
> npm run start
```

This will start a live version of the React Server.


from os import error, getcwd, path, mkdir, walk
from flask import Flask, request, session, send_from_directory, jsonify, abort
from werkzeug.utils import secure_filename
from web3.auto import w3
from eth_account.messages import encode_defunct
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
from Services.database import db, Files
from Services.helpers import login_required
from random import randint
from datetime import datetime

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__)

CORS(app, supports_credentials=True)

UPLOAD_DIRECTORY = getcwd()
app.config['UPLOAD_FOLDER'] = UPLOAD_DIRECTORY
app.config['SECRET_KEY'] = "asijfaieufi1jb2i4jbijkdsnjo32ur32r"
app.config["JWT_SECRET_KEY"] = "36babeb3b17611ea80862816a84a348ce8b25e23b23511eabbaf2816a84a348c05a4638bb23611ea919e2816a84a348c"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.app = app
db.init_app(app)
db.create_all()
jwt = JWTManager(app)

CODES = {}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
@login_required
def fileUpload():
    target = path.join(UPLOAD_DIRECTORY, 'Files')
    if not path.isdir(target):
        mkdir(target)
    file = request.files['file']
    filename = secure_filename(file.filename)
    if not allowed_file(filename):
        return jsonify({'message': "Incompatible File Type!"})
    destination = "/".join([target, filename])
    session['uploadFilePath'] = destination

    file_description = request.args.get("description")
    file_author = request.args.get("authorName")
    upload_time = datetime.utcnow()

    f = Files(owner_address=session.get('user')[
              'publicAddress'], author=file_author, name=filename, description=file_description, date=upload_time)
    db.session.add(f)
    db.session.commit()
    file.save(destination)
    return jsonify({'message': "Successfully Uploaded File!"})


@app.route('/getcode')
def getCode():
    requester = request.args.get("requester")
    filename = request.args.get("filename")
    pk = request.args.get("pk")
    message = encode_defunct(text=f"{requester}, {filename}")
    signature = w3.eth.account.sign_message(message, private_key=pk)
    return jsonify({"signature": signature["signature"].hex()})


@app.route('/files')
@login_required
def getFiles():
    filename = request.args.get("filename")
    authToken = request.args.get("authtoken")
    owner = Files.query.filter_by(name=filename).one().owner_address
    requester = session.get('user')['publicAddress']
    message = encode_defunct(
        text=f"{requester}, {filename}")
    # Who signed the message
    authorizer = w3.eth.account.recover_message(message, signature=authToken)
    if authorizer == owner:
        uploads = path.join(UPLOAD_DIRECTORY, 'Files')
        return send_from_directory(uploads, filename)
    else:
        abort(401)


@app.route('/api/fileNames')
def getFileNames():
    try:
        files = Files.query.all()
    except:
        return jsonify({"files": []})
    res = []

    for i in files:
        res.append({
            'owner_address': i.owner_address,
            'file_name': i.name,
            'description': i.description,
            'author': i.author,
            'date': i.date
        })
    return jsonify({"files": res})


@ app.route('/logout')
def logout():
    session.clear()
    return jsonify({'message': 'logged out'})


@ app.route('/api/auth', methods=['POST'])
def auth():
    address = request.get_json()['publicAddress']
    signature = request.get_json()['signature']
    message = encode_defunct(
        text=f"I am signing my one-time nonce: {CODES[address]}")
    PA = w3.eth.account.recover_message(message, signature=signature)
    info = {'publicAddress': PA}
    if address.lower() != PA.lower():
        abort(401)
    session['user'] = info
    access_token = create_access_token(
        identity=info)
    return jsonify(access_token)


@ app.route('/api/users')
def users():
    address = request.args.get('publicAddress')
    nonce = randint(0, 10000000)
    CODES[address] = nonce
    answer = {
        "publicAddress": address,
        "nonce": nonce,
    }
    return jsonify([answer])

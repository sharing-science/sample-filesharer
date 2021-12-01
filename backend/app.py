from logging import error
import os
from flask import Flask, request, session, send_from_directory, current_app
from werkzeug.utils import secure_filename
from flask_cors import CORS

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__)
CORS(app)

UPLOAD_DIRECTORY = os.getcwd()
app.config['UPLOAD_FOLDER'] = UPLOAD_DIRECTORY
app.config['SECRET_KEY'] = "asijfaieufi1jb2i4jbijkdsnjo32ur32r"


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def fileUpload():
    if request.method == 'GET':
        filename = request.args.get('filename')
        uploads = os.path.join(UPLOAD_DIRECTORY, 'Files')
        return send_from_directory(uploads, filename)
    elif request.method == 'POST':
        target = os.path.join(UPLOAD_DIRECTORY, 'Files')
        if not os.path.isdir(target):
            os.mkdir(target)
        file = request.files['file']
        filename = secure_filename(file.filename)
        if not allowed_file(filename):
            return ""
        destination = "/".join([target, filename])
        file.save(destination)
        session['uploadFilePath'] = destination
        return ""

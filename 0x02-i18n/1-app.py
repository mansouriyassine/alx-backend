#!/usr/bin/env python3
"""
1-app Module

Basic Flask app with Babel setup.
"""

from flask import Flask, render_template
from flask_babel import Babel

app = Flask(__name__)
babel = Babel(app)


class Config:
    """Configuration class for Flask app."""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

app.config.from_object(Config)


@app.route('/')
def index():
    """Route to render index.html."""
    return render_template('1-index.html', title='Welcome to Holberton',
                           header='Hello world')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

pipeline {
    agent {
        docker {
            image 'python:3.12-bullseye'  // Python included
            args '-u root'                // run as root
        }
    }

    stages {
        stage('Checkout') { steps { checkout scm } }

        stage('Setup') {
            steps {
                sh '''
                python -m venv venv
                source venv/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
                apt-get update
                apt-get install -y nodejs npm
                '''
            }
        }

        stage('Backend Test') {
            steps { sh 'source venv/bin/activate && pytest tests/' }
        }

        stage('Frontend') {
            steps { sh 'cd frontend && npm install && npm run build' }
        }

        stage('Deploy') { steps { echo 'Deploy here...' } }
    }
}

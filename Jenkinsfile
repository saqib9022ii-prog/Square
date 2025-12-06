pipeline {
    agent any

    environment {
        BASE_DIR = "${WORKSPACE}"  // Jenkins workspace
        PYTHON_ENV = "${WORKSPACE}/venv"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Setup Python') {
            steps {
                echo 'Setting up Python virtual environment...'
                sh '''
                python3 -m venv venv
                source venv/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
                '''
            }
        }

        stage('Backend Test') {
            steps {
                echo 'Running backend tests...'
                sh '''
                source venv/bin/activate
                pytest tests/ || exit 1
                '''
            }
        }

        stage('Setup Frontend') {
            steps {
                echo 'Installing frontend dependencies...'
                sh '''
                cd frontend
                npm install
                npm run build
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying project...'
                sh '''
                # Example: copy backend files to server
                # scp -r * user@server:/path/to/project
                # Restart backend server (systemctl or uwsgi)
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs!'
        }
    }
}

pipeline {
    agent any

    environment {
        VENV_DIR = "${WORKSPACE}/venv"
        FRONTEND_DIR = "${WORKSPACE}/frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/saqib9022ii-prog/Square.git'
            }
        }

        stage('Setup Backend') {
            steps {
                sh '''
                # Install Python venv if not already
                python3 -m venv ${VENV_DIR}
                source ${VENV_DIR}/bin/activate
                pip install --upgrade pip
                if [ -f requirements.txt ]; then
                    pip install -r requirements.txt
                fi
                '''
            }
        }

        stage('Backend Tests') {
            steps {
                sh '''
                source ${VENV_DIR}/bin/activate
                if [ -d tests ]; then
                    pytest tests/ || exit 1
                else
                    echo "No tests found, skipping backend tests."
                fi
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                if [ -d ${FRONTEND_DIR} ]; then
                    # Use Docker Node image from host
                    docker run --rm -v ${FRONTEND_DIR}:/app -w /app node:18-bullseye bash -c "
                        npm install
                        npm run build
                    "
                else
                    echo "Frontend directory not found, skipping frontend build."
                fi
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '✅ Deploy stage - add your deployment steps here'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check logs.'
        }
    }
}

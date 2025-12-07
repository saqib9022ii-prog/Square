pipeline {
    agent {
        docker {
            image 'node:18-bullseye'
            args '-u root' // Run as root to access docker & install packages
        }
    }

    environment {
        VENV_DIR = "${WORKSPACE}/venv"
        FRONTEND_DIR = "${WORKSPACE}/frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', 
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/saqib9022ii-prog/Square.git']]
                ])
            }
        }

        stage('Setup Environment') {
            steps {
                sh '''
                # Install Python if not present
                python3 --version || apt-get update && apt-get install -y python3 python3-venv python3-pip

                # Create virtual environment
                python3 -m venv ${VENV_DIR}
                source ${VENV_DIR}/bin/activate

                # Upgrade pip & install backend requirements
                pip install --upgrade pip
                if [ -f requirements.txt ]; then
                    pip install -r requirements.txt
                fi

                # Ensure Node & npm are available
                node -v
                npm -v
                '''
            }
        }

        stage('Backend Test') {
            steps {
                sh '''
                source ${VENV_DIR}/bin/activate
                if [ -d tests ]; then
                    pytest tests/ || exit 1
                else
                    echo "No tests directory found, skipping backend tests."
                fi
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                if [ -d ${FRONTEND_DIR} ]; then
                    cd ${FRONTEND_DIR}
                    npm install
                    npm run build
                else
                    echo "Frontend directory not found, skipping frontend build."
                fi
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '✅ Deploy stage - add deployment steps here'
            }
        }
    }

    post {
        success { echo '✅ Pipeline completed successfully!' }
        failure { echo '❌ Pipeline failed! Check logs.' }
    }
}

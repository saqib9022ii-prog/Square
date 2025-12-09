pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    docker.image('node:20-bullseye').inside {
                        sh """
                        cd client/front-end
                        npm install
                        npm run build
                        """
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    docker.image('python:3.13-slim').inside {
                        sh '''
                        cd back-end
                        pip install -r requirements.txt
                        '''
                    }
                }
            }
        }

        // Add additional stages (test, deploy, etc.) as needed
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}

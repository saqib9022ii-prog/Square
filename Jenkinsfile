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
                    // Use Node 20 for frontend build
                    docker.image('node:20-bullseye').inside {
                        dir('client/front-end') {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    // Use Python 3.13 for backend build
                    docker.image('python:3.13-slim').inside {
                        dir('back-end') {
                            sh 'pip install -r requirements.txt'
                            // You can add backend build/test commands here
                        }
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

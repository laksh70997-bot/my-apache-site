pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/laksh70997-bot/my-apache-site.git'
            }
        }

        stage('Validate') {
            steps {
                echo 'Checking files...'
                sh 'ls -la'
                sh 'test -f index.html && echo "index.html found" || echo "WARNING: index.html missing"'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed. Check logs.'
        }
    }
}

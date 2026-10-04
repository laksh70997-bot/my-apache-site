pipeline {
  agent any

  environment {
    AWS_DEFAULT_REGION = 'us-east-1'
    LAUNCH_TEMPLATE_ID = 'lt-0eca57a88bb225ece'
    SCANNER_HOME       = tool 'sonar-scanner'
  }

  options {
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/laksh70997-bot/my-apache-site.git'
      }
    }

    stage('Validate') {
      steps {
        echo 'Checking files...'
        sh 'ls -la'
        sh 'test -f index.html && echo index.html found'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Lint & Unit Tests') {
      steps {
        sh 'npm run lint'
        sh 'npm test'
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'reports/junit.xml'
        }
      }
    }

    stage('Dependency Scan - npm audit') {
      steps {
        sh '''
          mkdir -p reports
          npm audit --json > reports/npm-audit.json || true
          npm audit --audit-level=high
        '''
      }
    }

    stage('Vulnerability Scan - Trivy') {
      steps {
        sh '''
          mkdir -p reports
          trivy fs --scanners vuln,secret --severity HIGH,CRITICAL \
            --skip-dirs .git --format json --output reports/trivy-fs.json --exit-code 0 .
          trivy fs --scanners vuln,secret --severity HIGH,CRITICAL \
            --skip-dirs .git --exit-code 1 .
        '''
      }
    }

    stage('SonarQube Analysis + Quality Gate') {
      steps {
        withSonarQubeEnv('sonarqube') {
          sh '''
            ${SCANNER_HOME}/bin/sonar-scanner \
              -Dsonar.qualitygate.wait=true \
              -Dsonar.qualitygate.timeout=300
          '''
        }
      }
    }

    stage('Launch Apache EC2') {
      steps {
        sh '''
          aws ec2 run-instances \
            --launch-template LaunchTemplateId=${LAUNCH_TEMPLATE_ID} \
            --count 1 \
            --tag-specifications \
            ResourceType=instance,Tags=[{Key=Name,Value=Apache-Deploy-${BUILD_NUMBER}}]
        '''
      }
    }
  }

  post {
    always  { archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true }
    success { echo 'All checks passed. New Apache EC2 launched!' }
    failure { echo 'Pipeline failed. A quality or security gate blocked deployment. Check logs.' }
  }
}
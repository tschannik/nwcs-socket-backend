/**
 * Library name should match the name configured in Jenkins > Configure system > Global Pipeline Libraries.
 * Annotation can be omitted if configured to be loaded implicitly.
 */
@Library("appsteam-pipeline") _

createPipeline([
  useGit(),
  useYamlDeclaration(".cicd/pipeline.yml")
]);
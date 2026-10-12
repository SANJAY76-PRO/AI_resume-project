/* ============================================================
   The skill catalogue.
   `group` is used for the tooltip; PRIORITY orders the suggestions so
   the skills hiring teams most often search for come first.
   ============================================================ */

export const CATALOGUE = [
  { group: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C++', 'SQL'] },
  { group: 'Frontend', skills: ['React', 'Vue', 'Next.js', 'HTML', 'CSS', 'Tailwind', 'Redux'] },
  {
    group: 'Backend',
    skills: ['Node.js', 'Express', 'Django', 'Flask', 'REST', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  { group: 'Cloud/DevOps', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux', 'Terraform'] },
  { group: 'Data/ML', skills: ['Pandas', 'NumPy', 'scikit-learn', 'TensorFlow', 'PyTorch'] },
  { group: 'Practices', skills: ['Testing', 'Agile', 'Scrum', 'Accessibility', 'Performance'] },
];

/* Each skill can be written several ways in a real resume.
   The key is the display name; the first alias is the canonical spelling. */
export const ALIASES = {
  JavaScript: ['javascript', 'js', 'es6', 'ecmascript'],
  TypeScript: ['typescript', 'ts'],
  'Node.js': ['node.js', 'nodejs', 'node js', 'node'],
  'Next.js': ['next.js', 'nextjs'],
  React: ['react', 'react.js', 'reactjs'],
  Vue: ['vue', 'vue.js', 'vuejs'],
  PostgreSQL: ['postgresql', 'postgres', 'psql'],
  MongoDB: ['mongodb', 'mongo'],
  AWS: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
  'CI/CD': ['ci/cd', 'ci-cd', 'continuous integration', 'github actions', 'jenkins'],
  Testing: ['testing', 'unit test', 'jest', 'pytest', 'vitest', 'cypress'],
  REST: ['rest', 'restful', 'rest api'],
  CSS: ['css', 'css3', 'sass', 'scss'],
  HTML: ['html', 'html5'],
  'C++': ['c++', 'cpp'],
  Go: ['golang', ' go '],
  SQL: ['sql', 'mysql', 'sqlite'],
  'scikit-learn': ['scikit-learn', 'sklearn'],
  Accessibility: ['accessibility', 'a11y', 'wcag', 'aria'],
  Performance: ['performance', 'optimization', 'optimisation', 'lighthouse'],
  Agile: ['agile'],
  Scrum: ['scrum'],
  Linux: ['linux', 'ubuntu', 'unix'],
  GraphQL: ['graphql', 'apollo'],
  Tailwind: ['tailwind'],
  Redux: ['redux'],
  Express: ['express'],
  Django: ['django'],
  Flask: ['flask'],
  Pandas: ['pandas'],
  NumPy: ['numpy'],
  TensorFlow: ['tensorflow', 'tf.keras'],
  PyTorch: ['pytorch', 'torch'],
  Terraform: ['terraform'],
  Kubernetes: ['kubernetes', 'k8s', 'eks', 'helm'],
  Docker: ['docker', 'dockerfile', 'docker-compose'],
  Git: ['git', 'github', 'gitlab', 'bitbucket'],
  Java: ['java '],
  Python: ['python'],
};

/* Order in which missing skills are suggested. */
export const PRIORITY = [
  'Git',
  'SQL',
  'Docker',
  'AWS',
  'Testing',
  'React',
  'TypeScript',
  'CI/CD',
  'REST',
  'Node.js',
];

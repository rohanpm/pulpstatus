from setuptools import setup, find_packages

setup(name='pulpstatus',
      version='1.0',
      description='Pulp Status',
      author='Rohan McGovern',
      author_email='rmcgover@redhat.com',
      packages = find_packages(),
      url='https://github.com/rohanpm/pulpstatus',
      entry_points={
        'console_scripts': [
            'pulpstatus-primer = pulpstatus.primer:main_func',
        ],
      },
)

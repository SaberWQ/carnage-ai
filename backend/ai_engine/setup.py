"""
Setup file for Cython compilation
Run: python setup.py build_ext --inplace
"""
from setuptools import setup, Extension
from Cython.Build import cythonize
import numpy as np

extensions = [
    Extension(
        "neural_network_cython",
        ["neural_network.pyx"],
        include_dirs=[np.get_include()],
        extra_compile_args=["-O3", "-march=native"],
    )
]

setup(
    name="carnage_ai_engine",
    ext_modules=cythonize(extensions, compiler_directives={'language_level': "3"}),
)

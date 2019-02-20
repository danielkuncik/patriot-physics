# the following is a Python program that
# reads the file 'unit_map.json'
# and then makes a table of files that contain all of the
# directories and basic files for all units and pods

# it works only by running python from the terminal


import os
import subprocess
# https://www.journaldev.com/16140/python-system-command-os-subprocess-call
import json


#intentional global variable
json_file = open('unit_map.json','r')
unit_map = json.load(json_file)

# this scripts works only when run in the termal, not when run on pychar
# does it have to do with which version of python i am using????


# tests if a file with the filename exists in a directory
# if it does not, it creats it
# root is the directory in which the program is run
def make_new_file(filename, directory):
    files_I_have = subprocess.check_output(['ls',directory]).split('\n')
    if (filename in files_I_have):
        print('File ' + directory + '/' + filename + ' is already there')
    else:
        print('Creating new file ' + directory + '/' + filename)
        cmd = 'touch ' + directory + '/' + filename
        os.system(cmd)

# looks in parent_directory
# if there is not already a directory with the name of new_direcotry
# it creates it
def make_new_directory(new_directory, parent_directory):
    files_I_have = subprocess.check_output(['ls',parent_directory]).split('\n')
    if (new_directory in files_I_have):
        print('Directory ' + parent_directory + '/' + new_directory + ' is already there')
    else:
        print('Creating new directory ' + parent_directory + '/' + new_directory)
        cmd = 'mkdir ' + parent_directory + '/' + new_directory
        os.system(cmd)


def look_for_extra_directories(directory_to_search, list_of_wanted_directories):
    extraneous_directory_list = []
    files_I_have = subprocess.check_output(['ls',directory_to_search]).split('\n')
    for existing_directory in files_I_have[0:-1]:
        if existing_directory not in list_of_wanted_directories and '.' not in existing_directory:
            extraneous_directory_list.append(directory_to_search + '/' + existing_directory)
    if len(extraneous_directory_list) > 0:
        return extraneous_directory_list
    else:
        return None

def create_all_necessary_files_in_units_folder():
    for unit_cluster_key in unit_map.keys():
        make_new_directory(unit_cluster_key,'.')
        make_new_file(unit_cluster_key + '_unit_cluster_page.hbs', './' + unit_cluster_key)
        unit_cluster = unit_map[unit_cluster_key]
        if ('units' in unit_cluster.keys()):
            for unit_key in unit_cluster['units'].keys():
                make_new_directory(unit_key,'./' + unit_cluster_key)
                make_new_file(unit_key + '_unit_page.hbs', './' + unit_cluster_key + '/' + unit_key)
                unit = unit_cluster['units'][unit_key]
                if ('pods' in unit.keys()):
                    for pod_key in unit['pods'].keys():
                        make_new_directory(pod_key, './' + unit_cluster_key + '/' + unit_key)
                        make_new_file(pod_key + '_pod_page.hbs', './' + unit_cluster_key + '/' + unit_key + '/' + pod_key)



def look_for_extraneous_files_in_units_folder():
    all_extraneous_files = []
    all_unit_cluster_keys = unit_map.keys()
    extra_files = look_for_extra_directories('.',all_unit_cluster_keys)
    if extra_files:
        for file in extra_files:
            all_extraneous_files.append(file)
    for unit_cluster_key in all_unit_cluster_keys:
        this_unit_cluster = unit_map[unit_cluster_key]
        if 'units' in this_unit_cluster:
            all_unit_keys_in_this_unit_cluster = this_unit_cluster['units'].keys()
            extra_files = look_for_extra_directories('./' + unit_cluster_key,all_unit_keys_in_this_unit_cluster)
            if extra_files:
                for file in extra_files:
                    all_extraneous_files.append(file)
            for unit_key in all_unit_keys_in_this_unit_cluster:
                this_unit = this_unit_cluster['units'][unit_key]
                if 'pods' in this_unit:
                    pods_in_this_unit = this_unit['pods']
                    extra_files = look_for_extra_directories('./' + unit_cluster_key + '/' + unit_key, pods_in_this_unit)
                    if extra_files:
                        for file in extra_files:
                            all_extraneous_files.append(file)
    print('-----------')
    print('-----------')
    for file in all_extraneous_files:
        print('EXTRANEOUS FILE: ' + file)

look_for_extraneous_files_in_units_folder()
#!/bin/bash

# Colors
readonly endcolor='\033[0m'
readonly red='\033[0;31m'
readonly green='\033[0;32m'
readonly yellow='\033[0;33m'
readonly blue='\033[0;34m'
readonly cyan='\033[0;36m'

# Constants
readonly date=$(date +%Y%m%d)
readonly script_path=$(dirname $(realpath $0))
readonly backup_diretory=~/Documentos
readonly log_file="$HOME/backups/backup-${date}_out.log"
readonly files_to_exlude="${script_path}/exclude-files.txt"

function log () {
  # Define color and type of message
  local typecolor=$cyan
  local type="INFO"
  case "$2" in
    ERROR)
      typecolor="$red"
      type="ERROR"
      ;;
    WARNING)
      typecolor="$yellow"
      type="WARNING"
      ;;
    SUCCESS)
      typecolor="$green"
      type="SUCCESS"
      ;;
  esac

  # Escribimos el mensaje en el archivo de log
  echo -e "$blue[$(date)]$endcolor [$typecolor${type}$endcolor] # $1" >> $log_file
}

function check_log_file () {
  # Check if log file exists
  if [[ ! -f $log_file ]]; then
    touch $log_file
  else
    echo "" >> $log_file
  fi

  # Check if log file is writable
  if [[ ! -w $log_file ]]; then
    echo "El archivo $log_file no tiene permisos de escritura"
    exit 1
  fi
}

function check_files_to_exclude () {
  if [[ ! -f $files_to_exlude ]]; then
    log "El archivo $files_to_exlude no existe" "ERROR"
    exit 1
  fi
}

function check_backup_diretory () {
  if [[ ! -d $backup_diretory ]]; then
    log "El directorio $backup_diretory no existe" "ERROR"
    exit 1
  fi
}

function main () {
  if [[ -z $1 ]]; then
    backup_path="$HOME/backup-${date}.tar.gz"
  else
    backup_path="$1"
  fi
  
  # Comprobamos si el archivo de log existe y si tiene permisos de escritura
  check_log_file

  log "Inicio de la ejecución del script"

  # Comprobamos el archivo log y el nombre del archivo de copia de seguridad
  check_files_to_exclude
  check_backup_diretory

  # Nos movemos al directorio donde queremos crear la copia de seguridad
  cd $backup_diretory

  # Empaquetamos los archivos y directorios que queremos copiar
  tar --exclude-from=$files_to_exlude -zcvf $backup_path * &> /dev/null

  # Comprobamos si la copia de seguridad se ha creado correctamente
  if [[ $? -eq 0 ]]; then
    log "Copia de seguridad creada correctamente en: $backup_path" "SUCCESS"
  else
    log "Error al crear la copia de seguridad" "ERROR"
  fi

  log "Fin de la ejecución del script"
}

main $1
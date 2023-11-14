# Crontab

Aplicación de node que simula un crontab para automatizar la ejecución de tareas. Tiene una tarea que ejecuta una copia de seguridad y la sube a MEGA.

- [Crontab](#crontab)
  - [Añadir una tarea nueva](#añadir-una-tarea-nueva)
  - [Formato](#formato)

## Añadir una tarea nueva

Añadir al archivo `jobs.json`. Por ejemplo,

```json
"prueba": {
  "cron": "* * * * *"
}
```

Después hay que añadir al archivo `lib/jobs-actions.js` la función con el mismo nombre.
Si solo se quiere ejecutar un comando, se puede añadir en el `jobs.json` asi:

```json
"prueba": {
  "cron": "30 18 * * *",
  "command": "mkdir $HOME/Desktop/prueba"
}
```

De esta forma no hara falta crear su función en el mapa, ejecutará el comando directamente.

También se puede hacer en el archivo `jobs` con un formato mas parecido al del cron, quedaría de la siguiente forma

```bash
prueba * * * * * mkdir $HOME/Desktop/prueba
prueba2 30 18 * 1 1
```

***IMPORTANTE*** El nombre debe ser único y ese es el único orden válido\
\
El archivo `jobs.json` tiene prioridad sobre el `jobs`, por lo que si se quiere usar con formato cron se debera borrar el otro

## Formato

```txt
 ---------> Minutos
|  -------> Horas
| |  -----> Día del mes
| | |  ---> Mes
| | | |  -> Día de la semana
| | | | |
* * * * *
```

Ejemplos:
> *Todos los dias a las 16:45*\
> 45 16 ** *
>
> *Todos los martes de febrero a cada hora a las y media*\
> 30 ** 2 2


exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
      table.increments('user_id').primary();
      table.string('username').notNullable().defaultTo('');
      table.string('password').notNullable().defaultTo('');
      table.string('email').unique().notNullable().defaultTo('');
      table.timestamps('created_at');
  })
  .then(function () {
    return knex.schema.createTable('tasks', function (table) {
        table.increments('task_id').primary();
        table.timestamps('created_at');
        table.string('task_name').notNullable().defaultTo('');
        table.integer('points').notNullable().defaultTo(25);
        table.boolean("status").defaultTo(false);
        //incorrect way to store photo. Need to look into this
        table.string('photo');
        table.integer('bonus');
        table.string("category");
    });
})
  .then(function () {
    return knex.schema.createTable('lists', function (table) {
        table.increments('list_id').primary();
        table.string('title').notNullable().defaultTo('');
        table.timestamps('created_at');
        table.foreign('tasks').references('tasks.task_id');
    });
})
  .then(function () {
    return knex.schema.createTable('teams', function (table) {
      table.increments('team_id').primary();
      table.string('team_name').notNullable().defaultTo('');
      table.timestamps('created_at');
      table.foreign('users').references('users.user_id');
    });
  })
  .then(function () {
      return knex.schema.createTable('hunts', function (table) {
          table.increments('hunt_id').primary();
          table.foreign('admin').references('users.user_id');
          table.foreign('list').references('lists.list_id');
          table.foreign('teams').references('teams.team_id');
          table.string('title').notNullable().defaultTo('');
          table.timestamps('created_at');
          table.dateTime('start_time').notNullable();
          table.dateTime('end_time');
          table.string('description');
      });
  })
  .then(function () {
    return knex.schema.createTable('user_teams', function (table) {
        table.increments('user_teams_id').primary();
        table.foreign('user_ids').references('users.user_id');
        table.foreign('teams_ids').references('teams.team_id');
    });
  })
  .then(function () {
      return knex.schema.createTable('list_tasks', function (table) {
          table.increments('list_tasks_id').primary();
          table.foreign('list_ids').references('lists.list_id');
          table.foreign('task_ids').references('tasks.task_id');
      });
  });
};

exports.down = function (knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('list_tasks'),
      knex.schema.dropTable('user_teams'),
      knex.schema.dropTable('hunts'),
      knex.schema.dropTable('teams'),
      knex.schema.dropTable('lists'),
      knex.schema.dropTable('tasks'),
      knex.schema.dropTable('users'),
  ]);    
};

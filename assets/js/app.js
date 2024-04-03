$(async function show() {
    //show add item box
    $(".add-task-bt button").click(function (e) {
        $(".layout").removeClass("none");
        $(".add-task-item").removeClass("none");
    })

    //close add item box
    $(".close-bt").click(function (e) {
        $(".layout").addClass("none");
        $(".add-task-item").addClass("none");
        $(".update-task-item").addClass("none");
        window.location.reload()
    })

    //verify tipe task add
    $("input#taskTitleAdd").on('input', function (e) {
        if (/^[0-9a-zA-Z].{2,50}$/.test($(this).val())) {
            //si condition respectée : on active bt add
            $(this).nextAll("#submitAddBt").addClass("disableFalse");
            $(this).nextAll("#submitAddBt").attr({ disabled: false });
            return
        }

        //condition non respectée
        $(this).nextAll("#submitAddBt").removeClass("disableFalse");
        $(this).nextAll("#submitAddBt").attr({ disabled: true });

    })

    //verify tipe task update
    $("input#taskTitleUpdate").on('input', function (e) {
        if (/^[0-9a-zA-Z].{2,50}$/.test($(this).val())) {
            //si condition respectée : on active bt add
            $(this).nextAll("#submitUpdate").addClass("disableFalse");
            $(this).nextAll("#submitUpdate").attr({ disabled: false });
            return
        }

        //condition non respectée
        $(this).nextAll("#submitUpdate").removeClass("disableFalse");
        $(this).nextAll("#submitUpdate").attr({ disabled: true });

    })

    //submit valide task after is verified
    $("#submitAddBt").click(function (e) {
        e.preventDefault()
        let inputTask = $("input#taskTitleAdd").val()
        console.log(inputTask);
        let taskData = {
            task: inputTask,
            statusDone: false
        }
        addTask(taskData)
        $("input[type=reset]").trigger("click");
    })

    //show task on screen
    let taskDataAll = await getAllTask()
    console.log(taskDataAll);
    if (!taskDataAll.length) {
        //si aucune donnee
        let welcomeText = `
        <div class="emptyTask">
        vous n'avez aucune tâches !
        </div>
        `
        $(".display-task").html(welcomeText)
    } else {
        $(".display-task").html("")
        taskDataAll.forEach(taskDataItem => {
            let taskItem = `
            <div class="task-item" data-id="${taskDataItem._id}">
                            <div class="title-and-comment">${taskDataItem.task}</div>
                            <div class="delete-task">delete</div>
                            <div class="update-task">update</div>
                            <div class="${taskDataItem.statusDone}">done</div>
                        </div>
            `
            $(".display-task").append(taskItem);

            //manage task done bt color
            if (taskDataItem.statusDone) {
                $(".true").html("esc");
                $(".true").addClass("esc");
                $(".true").prevAll(".delete-task").addClass("esc");
                $(".true").prevAll(".update-task").addClass("esc");
                $(".true").addClass("true");
                $(".true").prevAll(".title-and-comment").css('color', '#ccc');
            }

        });
    }



    //marquer une tâche comme faite
    $(".task-item div:nth-child(4)").click(function (e) {
        // let parentCible = $(this).closest(".task-item")
        let parentCible = e.target.closest(".task-item")
        // let parentCible = $('.done-task').closest(".task-item")
        let id = parentCible.dataset.id
        let selectTask = taskDataAll.find(t => t._id == id)

        let taskData = {
            task: selectTask.task,
            statusDone: !selectTask.statusDone
        }

        const updateTodo = (id, todo) => {
            const index = taskDataAll.findIndex(t => t._id == id);
            if (index !== -1) {
                taskDataAll[index] = { ...taskDataAll[index], ...todo };
                updatedTask({ ...todo, _id: id })
            }
            window.location.reload()
        }
        updateTodo(selectTask._id, taskData)

    })

    //delete task
    $('.task-item div:nth-child(2)').click(function (e) {
        let parentCible = e.target.closest(".task-item")
        let id = parentCible.dataset.id
        let selectTask = taskDataAll.find(t => t._id == id)

        deleteTask(selectTask._id)

        window.location.reload()
    })

    //update task
    $(".task-item div:nth-child(3)").click(function (e) {
        let parentCible = e.target.closest(".task-item")
        let id = parentCible.dataset.id
        let selectTask = taskDataAll.find(t => t._id == id)

        let taskData = {
            task: selectTask.task,
            statusDone: selectTask.statusDone
        }

        $(".layout").removeClass("none")
        $(".update-task-item").removeClass("none")

        $("input#taskTitleUpdate").val(taskData.task)
        $("input#taskTitleUpdate").nextAll("input#hiddenId").val(id)
        $("input#taskTitleUpdate").nextAll("input#hiddenStatus").val(selectTask.statusDone)
    })

    //save update task
    $("#submitUpdate").click(function (e) {
        let id = $("input#taskTitleUpdate").nextAll("input[type=hidden]").val()
        let selectTask = taskDataAll.find(t => t._id == id)
        console.log(selectTask);

        let taskData = {
            task: $("input#taskTitleUpdate").val(),
            statusDone: $("input#hiddenStatus").val()
        }
        console.log(taskData);
        const updateTodo = (id, todo) => {
            const index = taskDataAll.findIndex(t => t._id == id);
            if (index !== -1) {
                taskDataAll[index] = { ...taskDataAll[index], ...todo };
                updatedTask({ ...todo, _id: id })
            }
        }
        updateTodo(selectTask._id, taskData)
    })

    //filter task
    $(".filter-check-box form input[type=radio]").on('input', function (e) {
        console.log($(this).val());
        //all task
        if ($(this).val() == "all") {
            // window.location.reload()
            $(".task-item").has(".true").css('display', 'flex')
            $(".task-item").has(".false").css('display', 'flex')
        }
        //tasks in progress
        if ($(this).val() == "in-progress") {
            $(".task-item").has(".true").css('display', 'none')
            $(".task-item").has(".false").css('display', 'flex')

            console.log($(".task-item").has(".true"));
        }
        //tasks done
        if ($(this).val() == "done") {
            $(".task-item").has(".false").css('display', 'none')
            $(".task-item").has(".true").css('display', 'flex')

            console.log($(".task-item").has(".false"));
            // $(".task-item").has(".true").css('display', 'block')
        }
    })
})
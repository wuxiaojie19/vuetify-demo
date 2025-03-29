<template>
  <v-card>
    <v-toolbar color="primary">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Your Dashboard</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-magnify"></v-btn>

      <v-btn icon="mdi-dots-vertical"></v-btn>

      <template v-slot:extension>
        <v-tabs v-model="tab" align-tabs="title">
          <v-tab v-for="item in items" :key="item.key" :text="item.value" :value="item.key"></v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :key="'Approval_flow_management'" :value="'Approval_flow_management'">
        <v-card title="Claims_Less_Then_5000">
          <template v-slot:text>
            <v-btn text="RESET FLOW" @click="resetFlow"></v-btn>
            {{ flowStep }}
            <v-stepper alt-labels>
              <v-stepper-header>
                <template v-for="(flow, index) in flowStep">
                  <v-stepper-item :value="flow.stepNo">
                    <template #title>
                      <div v-if="flow.approvalGroups.groups && flow.approvalGroups.groups.length"
                        style="margin-top:-8px">
                        <v-chip class="ma-1" label v-for="(approvalGroup, idx) in flow.approvalGroups.groups"
                          :key="approvalGroup.gid" style="min-width: 90px;" closable
                          @click:close="removeApproval(index, idx)">
                          <v-icon icon="mdi-account-circle-outline" start></v-icon>
                          {{ approvalGroup.groupName }}
                        </v-chip>
                      </div>
                      <div v-if="index === 0" class="mb-1">
                        Applicant
                      </div>
                    </template>
                    <v-btn icon="mdi-plus" @click="showGroup(index)" size="30" v-if="index > 0"></v-btn>
                  </v-stepper-item>

                  <v-divider> </v-divider>
                </template>

                <v-stepper-item value="">
                  <v-btn text="Add Step" prepend-icon="mdi-plus" @click="addStep"></v-btn>
                </v-stepper-item>
              </v-stepper-header>
            </v-stepper>


            <v-divider> </v-divider>

            <v-sheet border rounded class="mt-5">

              <v-data-table :headers="flowHeaders" :items="flowStep" hide-default-footer>
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>
                      <v-icon color="medium-emphasis" icon="mdi-sitemap-outline" size="s-small" start></v-icon>
                      Flow
                    </v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Add STEP" border
                      @click="addStep"></v-btn>
                  </v-toolbar>
                </template>
                <template v-slot:item.approvalGroups="{ value, index }">

                  <v-chip class="ma-1" label v-if="index === 0" style="min-width: 90px;">
                    <v-icon icon="mdi-account-circle-outline" start></v-icon>
                    Applicant
                  </v-chip>

                  <v-chip class="ma-1" label v-for="(group, idx) in value.groups" :key="group.gid"
                    style="min-width: 90px;" closable @click:close="removeApproval(index, idx)">
                    <v-icon icon="mdi-account-circle-outline" start></v-icon>
                    {{ group.groupName }}
                  </v-chip>
                </template>
                <template v-slot:item.actions="{ item, index }">
                  <v-btn prepend-icon="mdi-trash-can" text="Remove" @click="removeStep(index)" />
                </template>

              </v-data-table>
            </v-sheet>



            <v-dialog v-model="dialogFlow" max-width="500">
              <v-sheet width="300px">
                <v-card title="Select Group">
                  <template #append>
                    <v-btn variant="outlined" block @click="addApprovalGroup">Add</v-btn>
                  </template>
                  <template v-slot:text>
                    <v-radio-group inline label="Approval Type" v-model="approvalType">
                      <v-radio value="AND" label="AND" />
                      <v-radio value="OR" label="OR" />
                    </v-radio-group>
                    <v-select v-model="selectedGroups" :items="approvalGroupList" item-title="groupName"
                      item-value="gid" chips label="Group" multiple></v-select>
                  </template>
                </v-card>
              </v-sheet>
            </v-dialog>



          </template>
        </v-card>
      </v-tabs-window-item>
      <v-tabs-window-item :key="'Approval_group_management'" :value="'Approval_group_management'">
        <v-container width="90%">
          <v-sheet border rounded>
            <v-data-table :headers="headers" :items="approvalGroupList">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>
                    <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
                    Approval Groups
                  </v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Add A Group" border
                    @click="addGroup"></v-btn>
                </v-toolbar>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex ga-2 justify-end">
                  <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="remove(item.gid)"></v-icon>
                </div>
              </template>

              <template v-slot:no-data>
                <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border
                  @click="resetGroup"></v-btn>
              </template>
            </v-data-table>
          </v-sheet>

          <v-dialog v-model="dialog" max-width="500">
            <v-sheet width="300px">
              <v-card title="Create Group">
                <template #append>
                  <v-btn variant="outlined" block @click="createGroup">Create</v-btn>
                </template>
                <template v-slot:text>
                  <v-text-field v-model="approvalGroupName" :counter="10" label="Approval Group Name"
                    required></v-text-field>
                  <v-select v-model="selectedUsers" :items="users" item-title="name" item-value="uid" chips
                    label="Users" multiple></v-select>
                </template>
              </v-card>
            </v-sheet>
          </v-dialog>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item :key="'Approval_create_management'" :value="'Approval_create_management'">
        <v-card>
          <template v-slot:text>
            <v-card title="Process Approval">
              <template v-slot:text>
                <v-btn text="New Claims Flow" @click="newClaimsFlow"></v-btn>

                <v-stepper v-model="stepValue" alt-labels>
                  <v-stepper-header>
                    <template v-for="(flow, index) in flowStepClaims" :key="index">
                      <v-stepper-item :value="flow.stepNo" :complete="flow.status === 'pass'"
                        :error="flow.status === 'return' || flow.status === 'reject'" :error-icon="errorIcon">

                        <template #title>
                          <div v-if="flow.approvalGroups.groups && flow.approvalGroups.groups.length"
                            style="margin-top:-8px">
                            <v-chip class="ma-1" label v-for="approvalGroup in flow.approvalGroups.groups"
                              :key="approvalGroup.gid" style="min-width: 90px;">
                              <v-icon icon="mdi-account-circle-outline" start></v-icon>
                              {{ approvalGroup.groupName }}
                            </v-chip>
                          </div>
                          <div v-else class="mb-1">
                            Request Done
                          </div>
                        </template>
                        <template #subtitle>
                          <p v-for="act in flow.actions"> {{ act.actionTime }} {{ act.action }}</p>
                        </template>
                      </v-stepper-item>

                      <v-divider></v-divider>
                    </template>
                    <v-stepper-item :value="flowStepClaims.length + 1"
                      :complete="flowStepClaims[flowStepClaims.length - 1].status === 'pass'"
                      v-if="flowStepClaims.length">
                      End
                    </v-stepper-item>
                  </v-stepper-header>
                  <v-stepper-window>
                    <v-stepper-window-item :value="stepValue">
                      <v-card height="100" title="Claims No. : UC123467">
                        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                      </v-card>
                    </v-stepper-window-item>
                  </v-stepper-window>
                  <v-sheet style="display: flex" class="mb-1 mr-1 ml-1">
                    <v-btn text="Reject" color="grey-darken-3" :disabled="disabled" @click="reject"></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn text="Return" :disabled="disabled" @click="returnStep"></v-btn>
                    <v-btn :disabled="disabled" text="Approbate" class="ml-1" @click="approbate"></v-btn>
                  </v-sheet>
                </v-stepper>
              </template>
            </v-card>
          </template>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script setup>
import { ref, reactive, shallowRef, watch } from 'vue'

const tab = ref('Approval_flow_management')
const selectedUsers = ref()
const approvalGroupName = ref()
const dialog = shallowRef(false)
const dialogFlow = shallowRef(false)
const selectedGroups = ref()
const approvalType = ref('AND')
const initFlow =
{
  stepNo: 1,
  title: '',
  approvalType: '-',
  condition: [],
  approvalGroups: {
    groups: []
  },
}

const getInitFlow = () => {
  return JSON.parse(JSON.stringify(initFlow))
}
const flowStep = ref(
  JSON.parse(localStorage.getItem('flowStepClaims_Less_Then_5000')) || [getInitFlow()]
)

let currentStepIndex = 0

const approvalGroupList = ref(
  JSON.parse(localStorage.getItem('approvalGroupList')) || []
)

const headers = [
  { title: 'Group Id', key: 'gid' },
  { title: 'Group Name', key: 'groupName', align: 'start' },
  { title: 'User List', key: 'userList' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false },
]

const flowHeaders = [
  { title: 'Step No.', key: 'stepNo', align: 'center', sortable: false },
  { title: 'Approval Group', key: 'approvalGroups', align: 'start', sortable: false },
  { title: 'Approval Conditions', key: 'approvalConditions', align: 'start', sortable: false },
  { title: 'Approval Type(AND / OR)', key: 'approvalType', align: 'start', sortable: false },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false },
]

const flowStepClaims = ref(
  JSON.parse(localStorage.getItem('flowStepClaims_Less_Then_5000')) || []
)
if (flowStepClaims.value[0]) {
  flowStepClaims.value[0].status = 'pass'
  const actions = flowStepClaims.value[0].actions || []
  actions.push({
    actionTime: new Date().toLocaleString(),
    action: ''
  })
  flowStepClaims.value[0].actions = actions
}
const stepValue = ref(2)

const disabled = ref(false)

const errorIcon = ref('mdi-undo-variant')

const createGroup = () => {
  if (!approvalGroupName.value || !selectedUsers.value.length) {
    return
  }

  const user = selectedUsers.value.map(uid => {
    return users.find(u => u.uid === uid)
  })

  approvalGroupList.value.push({
    gid: new Date().getMilliseconds(),
    groupName: approvalGroupName.value,
    userList: user,
  })

  approvalGroupName.value = ''
  selectedUsers.value = []

  dialog.value = false
}

const addGroup = () => {
  dialog.value = true
}
const showGroup = index => {
  currentStepIndex = index
  dialogFlow.value = true
}

const addApprovalGroup = () => {
  addFlowPoint(currentStepIndex)
  dialogFlow.value = false
}

const addStep = () => {
  flowStep.value.push(getInitFlow())
  resetFlowStepNo()
}

const addFlowPoint = stepIndex => {
  if (flowStep.value[stepIndex]) {
    const approvalGroups = flowStep.value[stepIndex].approvalGroups.groups || []
    const datas =
      approvalGroupList.value.filter(group =>
        selectedGroups.value.includes(group.gid)
      ) || []
    approvalGroups.push(...datas)
    flowStep.value[stepIndex].approvalGroups.groups = approvalGroups
    flowStep.value[stepIndex].approvalType = approvalType.value
  } else {
    const datas =
      approvalGroupList.value.filter(group =>
        selectedGroups.value.includes(group.gid)
      ) || []
    flowStep.value[stepIndex] = datas
  }
  selectedGroups.value.length = 0
  approvalType.value = 'AND'
}

const removeApproval = (stepIndex, approvalGroupIndex) => {
  if (flowStep.value[stepIndex]) {
    const approvalGroups = flowStep.value[stepIndex].approvalGroups.groups
    approvalGroups.splice(approvalGroupIndex, 1)
    if (!approvalGroups.length) {
      flowStep.value.splice(stepIndex, 1)
    }
    resetFlowStepNo()
  }
}

const removeStep = (index) => {
  flowStep.value.splice(index, 1)
  resetFlowStepNo()
}

const resetFlowStepNo = () => {
  flowStep.value.forEach((flow, index) => {
    flow.stepNo = index + 1
  });
}

const resetGroup = () => {
  approvalGroupList.value = [{ "gid": 780, "groupName": "Approval Group 1", "userList": [{ "uid": "u1", "name": "Test User_1" }] }, { "gid": 427, "groupName": "Approval Group 2", "userList": [{ "uid": "u2", "name": "Test User_2" }] }, { "gid": 681, "groupName": "Approval Group 3", "userList": [{ "uid": "u3", "name": "Test User_3" }] }, { "gid": 861, "groupName": "Approval Group 4", "userList": [{ "uid": "u4", "name": "Test User_4" }] }, { "gid": 91, "groupName": "Approval Group 5", "userList": [{ "uid": "u5", "name": "Test User_5" }] }, { "gid": 30, "groupName": "Approval Group 6", "userList": [{ "uid": "u1", "name": "Test User_1" }, { "uid": "u2", "name": "Test User_2" }] }, { "gid": 823, "groupName": "Approval Group 7", "userList": [{ "uid": "u3", "name": "Test User_3" }, { "uid": "u4", "name": "Test User_4" }] }]
}
const resetFlow = () => {
  flowStep.value = [getInitFlow()]
}
const remove = gid => {
  const datas = approvalGroupList.value.filter(group => group.gid !== gid) || []
  approvalGroupList.value.length = 0
  approvalGroupList.value.push(...datas)
}

const newClaimsFlow = () => {
  flowStepClaims.value = JSON.parse(
    localStorage.getItem('flowStepClaims_Less_Then_5000')
  )
  flowStepClaims.value[0].status = true
  stepValue.value = 2
  disabled.value = false
}

const approbate = () => {
  flowStepClaims.value[stepValue.value - 1].status = 'pass'
  const actions = flowStepClaims.value[stepValue.value - 1].actions || []
  actions.push({
    actionTime: new Date().toLocaleString(),
    action: 'approval'
  })
  flowStepClaims.value[stepValue.value - 1].actions = actions

  stepValue.value = stepValue.value + 1
  if (stepValue.value > flowStepClaims.value.length) {
    disabled.value = true
  }
}

const reject = () => {
  errorIcon.value = '$error'
  flowStepClaims.value[stepValue.value - 1].status = 'reject'
  const actions = flowStepClaims.value[stepValue.value - 1].actions || []
  actions.push({
    actionTime: new Date().toLocaleString(),
    action: 'reject'
  })
  flowStepClaims.value[stepValue.value - 1].actions = actions
  disabled.value = true
}

const returnStep = () => {

  errorIcon.value = 'mdi-undo-variant'
  flowStepClaims.value[stepValue.value - 1].status = 'return'

  const actions = flowStepClaims.value[stepValue.value - 1].actions || []
  actions.push({
    actionTime: new Date().toLocaleString(),
    action: 'return'
  })
  flowStepClaims.value[stepValue.value - 1].actions = actions
  stepValue.value = stepValue.value - 1
}

resetFlowStepNo()
const items = [
  {
    key: 'Approval_flow_management',
    value: 'Approval flow management',
  },
  {
    key: 'Approval_group_management',
    value: 'Approval group management',
  },
  {
    key: 'Approval_create_management',
    value: 'Approval create management',
  },
]

const users = [
  {
    uid: 'u1',
    name: 'Test User_1',
  },
  {
    uid: 'u2',
    name: 'Test User_2',
  },
  {
    uid: 'u3',
    name: 'Test User_3',
  },
  {
    uid: 'u4',
    name: 'Test User_4',
  },
  {
    uid: 'u5',
    name: 'Test User_5',
  },
]

watch(
  flowStep,
  () => {
    localStorage.setItem(
      'flowStepClaims_Less_Then_5000',
      JSON.stringify(flowStep.value)
    )
    newClaimsFlow()
  },
  { deep: true }
)
watch(
  approvalGroupList,
  () => {
    localStorage.setItem('approvalGroupList', JSON.stringify(approvalGroupList.value))
  },
  { deep: true }
)

</script>
<style>
.v-stepper--alt-labels .v-stepper-item__avatar.v-avatar {
  margin-bottom: 8px;
}
</style>
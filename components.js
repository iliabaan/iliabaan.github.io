Vue.component('complete-page', {
   props: ['clientInfo', 'phone', 'medicalInfo', 'address'],
   computed: {
      fullAddress: function() {
         return `${this.address.postcode.value}, ${this.address.country.value}, ${this.address.region.value},
         ${this.address.city.value}, ул. ${this.address.street.value}, д. ${this.address.house.value}`
      },
   },
   template: `<div>
   <h2>Информация о созданном клиенте</h2>
   <div>
   <div><h3>Имя:</h3><p>{{clientInfo.secondName.value}} {{clientInfo.firstName.value}} {{clientInfo.middleName.value}}</p></div>
   <div><h3>Дата рождения:</h3><p>{{clientInfo.dateOfBirth.value}}</p></div>
   <div><h3>Номер телефона:</h3><p>{{phone.value}}</p></div>
   <div><h3>Адрес:</h3><p>{{fullAddress}}</p></div>
   <div><h3>Лечащий врач:</h3><p>{{medicalInfo.doctors.selected}}</p></div>
   <div><h3>Группы клиента:</h3><p v-for="group in medicalInfo.clientGroups.selected">{{group}}</p></div>
   </div>
   </div>`

})

Vue.component('personal-info', {
    data() {
      return {
        showElements: [
          {show: true},
          {show: false},
          {show: false},
          {show: false},
          {show: false},
        ],
        personalData: {
         clientInfo: {
           firstName: {value: '', showError: false},
           secondName: {value: '', showError: false},
           middleName: {value: '', showError: false},
           dateOfBirth: {value: '', showError: false},
           gender: {value: '', showError: false},
         },
           phone: {value: '', showError: false},
           sendSMS: false,
         documentInfo: {
           documentType: 'Паспорт',
           passSeries: {value: '', showError: false},
           passNumber: {value: '', showError: false},
           passIssued: {value: '', showError: false},
           passDate: {value: '', showError: false},
         },
         address: {
           postcode: {value: '', showError: false},
           country: {value: '', showError: false},
           region: {value: '', showError: false},
           city: {value: '', showError: false},
           street: {value: '', showError: false},
           house: {value: '', showError: false},
        },
        medicalInfo: {
           doctors: {
              selected: 'Иванов',
              list: ['Иванов', 'Захаров', 'Чернышева'],
           },
           clientGroups: {
              selected: [],
           },
           showError: false,
        },
      },
      };
    },
    methods: {
       validateData(type) {
          let i = 0;
          if (type === 'clientInfo') {
          for (let key in this.personalData.clientInfo) {
            this.personalData.clientInfo[key].showError = false;
             if (this.personalData.clientInfo[key].value === '') {
               this.personalData.clientInfo[key].showError = true;
             };
          };
            if (this.personalData.clientInfo.dateOfBirth.value.length !== 10) {
                  this.personalData.clientInfo.dateOfBirth.showError = true;
            } for (let key in this.personalData.clientInfo) {
               if (this.personalData.clientInfo[key].showError == false) {
                  i++;
               }
               if (i == 5) {
                  this.nextPage(0);
               };
            };
            } else if (type === 'address') {
               if (this.personalData.address.city.value.length) {
                  this.nextPage(3)
               } else this.personalData.address.city.showError = true;
            } else if (type === 'documentInfo') {
               this.personalData.documentInfo.passDate.showError = false;
               if (this.personalData.documentInfo.passDate.value.length !== 10) {
                  this.personalData.documentInfo.passDate.showError = true;
               } else this.finishRegistration();
            };
       },
       finishRegistration() {
         this.$emit('finishRegistration', this.personalData);
       },
       nextPage(number) {
          this.showElements[number].show = false;
          this.showElements[number+1].show = true;
       },
    },
    template: `<div class="personal-info flex__column">
    <h2>Регистрация</h2>
    <div class="flex__column">
       <div class="personal-info__column flex__column" v-if="showElements[0].show">
          <h3 div class="personal-info__column-p">Данные клиента</h3>
          <input type="text" class="input-min" placeholder="Фамилия" 
          v-model="personalData.clientInfo.secondName.value" v-bind:class="{errorInput: personalData.clientInfo.secondName.showError}">
          <input type="text" class="input-min" placeholder="Имя"
           v-model="personalData.clientInfo.firstName.value" v-bind:class="{errorInput: personalData.clientInfo.firstName.showError}">
          <input type="text" class="input-min" placeholder="Отчество"
           v-model="personalData.clientInfo.middleName.value" v-bind:class="{errorInput: personalData.clientInfo.middleName.showError}">
          <input type="text" class="input-min" placeholder="Дата рождения"
            v-model="personalData.clientInfo.dateOfBirth.value" v-bind:class="{errorInput: personalData.clientInfo.dateOfBirth.showError}" v-mask="'##.##.####'">
          <div class="flex__row personal-info__column-p" v-bind:class="{errorInput: personalData.clientInfo.gender.showError}">
             Пол: 
             <p>М<input type="radio" value="М" v-model="personalData.clientInfo.gender.value"></p>
             <p>Ж<input type="radio" value="Ж" v-model="personalData.clientInfo.gender.value"></p>
          </div>
          <button @click="validateData('clientInfo')">Продолжить</button>       
       </div>
       <div class="personal-info__column flex__column" v-if="showElements[1].show">
          <input type="text" class="input-min" v-mask="'+7(###)###-##-##'" v-model="personalData.phone.value"
            v-bind:class="{errorInput: personalData.phone.showError}" placeholder="Номер телефона">
          <div class="flex__row personal-info__column-p">Не отправлять СМС <input type="checkbox" v-model="personalData.sendSMS"></div>
          <button @click="personalData.phone.value.length === 16 ? nextPage(1) : personalData.phone.showError = true">Продолжить</button>
       </div>
       <div class="personal-info__column flex__column" v-if="showElements[2].show">
          <div class="flex__column">
             <p class="personal-info__column-p">Группа клиентов:</p>
             <div v-bind:class="{errorInput: personalData.medicalInfo.showError}">
                <p><input type="checkbox" value="VIP" v-model="personalData.medicalInfo.clientGroups.selected">
                   <label>VIP</label>
                </p>
                <p><input type="checkbox" value="Проблемные" v-model="personalData.medicalInfo.clientGroups.selected">
                   <label>Проблемные</label>
                </p>
                <p><input type="checkbox" value="ОМС" v-model="personalData.medicalInfo.clientGroups.selected">
                   <label>ОМС</label>
                </p>
             </div>
             <div class="flex__column div-option">
                <p class="personal-info__column-p">Лечащий врач:</p>
                <select v-model="personalData.medicalInfo.doctors.selected">
                <option v-for="doctor in personalData.medicalInfo.doctors.list">{{doctor}}</option>
                </select>
             </div>
          </div>
          <button @click="personalData.medicalInfo.clientGroups.selected.length ? nextPage(2) : personalData.medicalInfo.showError = true">Продолжить</button>
       </div>
       <div class="flex__column personal-info__column" v-if="showElements[3].show">
          <div class="flex__row">
             <div class="flex__column">
                <input type="text" class="input-min" placeholder="Индекс" 
                v-model="personalData.address.postcode.value" v-mask="'######'" v-bind:class="{errorInput: personalData.address.postcode.showError}">
                <input type="text" class="input-min" placeholder="Страна" v-model="personalData.address.country.value"
                v-bind:class="{errorInput: personalData.address.country.showError}">
                <input type="text" class="input-min" placeholder="Область" v-model="personalData.address.region.value"
                v-bind:class="{errorInput: personalData.address.region.showError}">
             </div>
             <div class="flex__column">
                <input type="text" class="input-min" placeholder="Город" v-model="personalData.address.city.value"
                v-bind:class="{errorInput: personalData.address.city.showError}">
                <input type="text" class="input-min" placeholder="Улица" v-model="personalData.address.street.value"
                v-bind:class="{errorInput: personalData.address.street.showError}">
                <input type="text" class="input-min" placeholder="Дом" v-model="personalData.address.house.value"
                v-bind:class="{errorInput: personalData.address.house.showError}">
             </div>
          </div>
          <button @click="validateData('address')">Продолжить</button>
       </div>
       <div class="flex__column personal-info__column" v-if="showElements[4].show">
          <div class="flex__column div-option">
             Тип документа: 
             <select v-model="personalData.documentInfo.documentType">
                <option>Паспорт</option>
                <option>Свид. о рождении</option>
                <option>Вод. удостоверение</option>
             </select>
          </div>
          <div class="flex__row">
             <input type="text" class="input-min" placeholder="Серия" v-model="personalData.documentInfo.passSeries.value">
             <input type="text" class="input-min" placeholder="Номер" v-model="personalData.documentInfo.passNumber.value">
          </div>
          <div class="flex__row">
             <input type="text" class="input-min" placeholder="Кем выдан" v-model="personalData.documentInfo.passIssued.value">
             <input type="text" class="input-min" placeholder="Дата выдачи" v-model="personalData.documentInfo.passDate.value"
             v-mask="'##.##.####'" v-bind:class="{errorInput: personalData.documentInfo.passDate.showError}">
          </div>
          <button @click="validateData('documentInfo')">Завершить регистрацию</button>
       </div>
    </div>
 </div>`
  })


Vue.component('validation-form', {
    data() {
      return {
         personalData: {},
         showReg: true,
         showFinal: false,
      }
    },
    methods: {
       finishReg(data) {
          this.personalData = data;
          this.showReg = false;
          this.showFinal = true;
       }
    },
    template: `<div class="validation flex__column">
    <complete-page v-bind="personalData" v-if="showFinal"></complete-page>
    <personal-info @finishRegistration="finishReg" v-if="showReg"></personal-info>
    </div>`
  })


  new Vue({
    el: '#app',
  })
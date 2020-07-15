<template>
  <div style="padding-bottom: 15px;">
    <p class="section">{{ section }}</p>
    <div :style="{ height: contentHeight }">
      <hooper ref="slider" :settings="hooperSettings" @slide="after">
        <slide
          v-for="(interviewPage, index1) in interviewSheet.interview_pages"
          :key="interviewPage.id"
        >
          <validation-observer
            :ref="`validationObserver${index1}`"
            v-slot="{ handleSubmit }"
            tag="div"
          >
            <div class="slide-wrap">
              <div
                v-for="questionItem in interviewPage.question_items"
                :key="questionItem.id"
                class="question-wrap"
              >
                <p class="question">
                  <span v-if="questionItem.required_flag" class="must"
                    >必須</span
                  >Q. {{ questionItem.question }}
                </p>
                <p class="question-attention">{{ questionItem.memo }}</p>
                <div
                  v-if="questionItem.answer_items.length > 0"
                  class="question-item-wrap"
                >
                  <div class="question-item-input">
                    <div
                      v-for="answerItem in questionItem.answer_items"
                      :key="answerItem.id"
                      class="question-item-input-wrap"
                    >
                      <validation-provider
                        v-slot="{ errors }"
                        :rules="
                          questionItem.required_flag == 1 ? 'required' : ''
                        "
                        :name="questionItem.question"
                        tag="div"
                      >
                        <div v-if="answerItem.type == 'text'">
                          {{ answerItem.before_string }}
                          <input
                            :ref="
                              `input_${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                            "
                            :type="answerItem.type"
                            v-model="
                              interviewAnswers[
                                `${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                              ]
                            "
                            :placeholder="answerItem.placeholder"
                          />
                          {{ answerItem.after_string }}
                        </div>
                        <div
                          v-if="answerItem.type == 'number'"
                          class="answerItem-wrap-flex"
                        >
                          <div style="margin-right: 5px;">
                            <div style="margin-bottom: 3px;">
                              <button
                                v-longclick="
                                  () =>
                                    stepUpNumber(
                                      `${interviewSheet.id}_${questionItem.id}_${answerItem.id}`,
                                      answerItem
                                    )
                                "
                                @click="
                                  stepUpNumber(
                                    `${interviewSheet.id}_${questionItem.id}_${answerItem.id}`,
                                    answerItem
                                  )
                                "
                                type="button"
                                class="number-plus-btn"
                              >
                                ＋
                              </button>
                            </div>
                            <input
                              :ref="
                                `input_${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                              "
                              :type="answerItem.type"
                              v-model="
                                interviewAnswers[
                                  `${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                                ]
                              "
                              :value="answerItem.num_default"
                              :placeholder="answerItem.placeholder"
                            />
                            <div style="margin-top: 3px;">
                              <button
                                v-longclick="
                                  () =>
                                    stepDownNumber(
                                      `${interviewSheet.id}_${questionItem.id}_${answerItem.id}`,
                                      answerItem
                                    )
                                "
                                @click="
                                  stepDownNumber(
                                    `${interviewSheet.id}_${questionItem.id}_${answerItem.id}`,
                                    answerItem
                                  )
                                "
                                type="button"
                                class="number-plus-btn"
                              >
                                ー
                              </button>
                            </div>
                          </div>
                          <div>{{ answerItem.after_string }}</div>
                        </div>
                        <div
                          v-if="answerItem.type == 'radio'"
                          style="position: relative;"
                        >
                          <input
                            :id="
                              `input_${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                            "
                            :ref="
                              `input_${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                            "
                            :type="answerItem.type"
                            v-model="
                              interviewAnswers[
                                `${interviewSheet.id}_${questionItem.id}`
                              ]
                            "
                            :value="answerItem.caption"
                            class="radio-inline__input"
                          />
                          <label
                            :for="
                              `input_${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                            "
                            class="radio-inline__label"
                            >{{ answerItem.caption }}</label
                          >
                        </div>
                        <div v-if="answerItem.type == 'checkbox'">
                          <input
                            :id="
                              `input_${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                            "
                            :ref="
                              `input_${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                            "
                            :type="answerItem.type"
                            :value="answerItem.id"
                            v-model="
                              interviewAnswers[
                                `${interviewSheet.id}_${questionItem.id}`
                              ]
                            "
                          />
                          <label
                            :for="
                              `input_${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                            "
                            >{{ answerItem.caption }}</label
                          >
                        </div>
                        <div v-if="answerItem.type == 'textarea'">
                          <textarea
                            :ref="
                              `input_${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                            "
                            v-model="
                              interviewAnswers[
                                `${interviewSheet.id}_${questionItem.id}_${answerItem.id}`
                              ]
                            "
                            rows="5"
                          ></textarea>
                        </div>
                        <p class="question-attention">{{ answerItem.memo }}</p>
                        <p v-show="errors.length" class="error">
                          {{ errors[0] }}
                        </p>
                      </validation-provider>
                    </div>
                  </div>
                </div>
                <div v-if="questionItem.child_items.length > 0">
                  <div
                    v-for="childItem in questionItem.child_items"
                    :key="childItem.id"
                  >
                    <div class="question-item-wrap">
                      <p class="question-item">
                        <span v-if="childItem.required_flag" class="must"
                          >必須</span
                        >{{ childItem.question }}
                      </p>
                      <p class="question-attention">{{ childItem.memo }}</p>
                      <div class="question-item-input">
                        <div
                          v-for="answerItem in childItem.answer_items"
                          :key="answerItem.id"
                          class="question-item-input-wrap"
                        >
                          <validation-provider
                            v-slot="{ errors }"
                            :rules="
                              childItem.required_flag == 1 ? 'required' : ''
                            "
                            :name="childItem.question"
                            tag="div"
                          >
                            <div v-if="answerItem.type == 'text'">
                              {{ answerItem.before_string }}
                              <input
                                :ref="
                                  `input_${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                "
                                :type="answerItem.type"
                                v-model="
                                  interviewAnswers[
                                    `${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                  ]
                                "
                                :placeholder="answerItem.placeholder"
                              />
                              {{ answerItem.after_string }}
                            </div>
                            <div
                              v-if="answerItem.type == 'number'"
                              class="answerItem-wrap-flex"
                            >
                              <div style="margin-right: 5px;">
                                <div style="margin-bottom: 3px;">
                                  <button
                                    v-longclick="
                                      () =>
                                        stepUpNumber(
                                          `${interviewSheet.id}_${childItem.id}_${answerItem.id}`,
                                          answerItem
                                        )
                                    "
                                    @click="
                                      stepUpNumber(
                                        `${interviewSheet.id}_${childItem.id}_${answerItem.id}`,
                                        answerItem
                                      )
                                    "
                                    type="button"
                                    class="number-plus-btn"
                                  >
                                    ＋
                                  </button>
                                </div>
                                <input
                                  :ref="
                                    `input_${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                  "
                                  :type="answerItem.type"
                                  v-model="
                                    interviewAnswers[
                                      `${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                    ]
                                  "
                                  :placeholder="answerItem.placeholder"
                                />
                                <div style="margin-top: 3px;">
                                  <button
                                    v-longclick="
                                      () =>
                                        stepDownNumber(
                                          `${interviewSheet.id}_${childItem.id}_${answerItem.id}`,
                                          answerItem
                                        )
                                    "
                                    @click="
                                      stepDownNumber(
                                        `${interviewSheet.id}_${childItem.id}_${answerItem.id}`,
                                        answerItem
                                      )
                                    "
                                    type="button"
                                    class="number-plus-btn"
                                  >
                                    ー
                                  </button>
                                </div>
                              </div>
                              <div>{{ answerItem.after_string }}</div>
                            </div>
                            <div
                              v-if="answerItem.type == 'radio'"
                              style="position: relative;"
                            >
                              <input
                                :id="
                                  `input_${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                "
                                :ref="
                                  `input_${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                "
                                :type="answerItem.type"
                                v-model="
                                  interviewAnswers[
                                    `${interviewSheet.id}_${childItem.id}`
                                  ]
                                "
                                :value="answerItem.caption"
                                class="radio-inline__input"
                              />
                              <label
                                :for="
                                  `input_${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                "
                                class="radio-inline__label"
                                >{{ answerItem.caption }}</label
                              >
                            </div>
                            <div v-if="answerItem.type == 'checkbox'">
                              <input
                                :id="
                                  `input_${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                "
                                :ref="
                                  `input_${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                "
                                :type="answerItem.type"
                                :value="answerItem.id"
                                v-model="
                                  interviewAnswers[
                                    `${interviewSheet.id}_${childItem.id}`
                                  ]
                                "
                                class="checkbox-inline__input"
                              />
                              <label
                                :for="
                                  `input_${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                "
                                class="checkbox-inline__label"
                                >{{ answerItem.caption }}</label
                              >
                            </div>
                            <div v-if="answerItem.type == 'textarea'">
                              <textarea
                                :ref="
                                  `input_${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                "
                                v-model="
                                  interviewAnswers[
                                    `${interviewSheet.id}_${childItem.id}_${answerItem.id}`
                                  ]
                                "
                                rows="5"
                              ></textarea>
                            </div>
                            <p class="question-attention">
                              {{ answerItem.memo }}
                            </p>
                            <p v-show="errors.length" class="error">
                              {{ errors[0] }}
                            </p>
                          </validation-provider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-wrap">
              <button
                id="btn-prev"
                @click="prev"
                v-show="currentIndex > 0"
                class="btn btn-back"
              >
                戻る
              </button>
              <button
                id="btn-next"
                @click="handleSubmit(next)"
                v-show="hasNext"
                class="btn btn-next"
              >
                次へ
              </button>
            </div>
          </validation-observer>
        </slide>
        <hooper-progress slot="hooper-addons"></hooper-progress>
      </hooper>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Hooper, Slide, Progress as HooperProgress } from 'hooper'
import 'hooper/dist/hooper.css'
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate'
import { longclick } from 'vue-long-click'
import { required, email } from 'vee-validate/dist/rules'
// import { mapState, mapActions } from 'vuex'

interface InterviewAnswer {
  [key: string]: any
}

interface HooperSetting {
  mouseDrag: boolean
  touchDrag: boolean
  wheelControl: boolean
  keysControl: boolean
}

export type DataType = {
  page: number
  currentIndex: number
  hasNext: boolean
  contentHeight: string
  section: string
  interviewAnswers: InterviewAnswer
  hooperSettings: HooperSetting
}

export default Vue.extend({
  name: 'App',
  components: {
    Hooper,
    Slide,
    HooperProgress
  },
  data(): DataType {
    return {
      page: 1,
      currentIndex: 0,
      hasNext: true,
      contentHeight: 'auto',
      section: '',
      interviewAnswers: {},
      hooperSettings: {
        mouseDrag: false,
        touchDrag: false,
        wheelControl: false,
        keysControl: false
      }
    }
  },
  mounted() {
    const prepare = async () => {
      this.section = this.interviewSheet.interview_pages[
        this.currentIndex
      ].section
      // if(this.$route.query.page != undefined) {
      //   this.page = this.$route.query.page;
      //   this.refs().slider.slideTo(this.page - 1);
      // }
      // console.log(this.interviewAnswers);

      this.interviewSheet.interview_pages.forEach((interviewPage: any) => {
        interviewPage.question_items.forEach((questionItem: any) => {
          questionItem.answer_items.forEach((answerItem: any) => {
            this.setAnswerKey(answerItem, questionItem)
          })
          questionItem.child_items.forEach((childItem: any) => {
            childItem.answer_items.forEach((answerItem: any) => {
              this.setAnswerKey(answerItem, childItem)
            })
          })
        })
      })
    }

    const prepareProcess = async () => {
      await this.getInterviewSheet()
      await prepare()
    }

    prepareProcess()
  },
  computed: {
    // ...mapState('interviewSheet', {
    //   interviewSheet: (state: any) => state.data
    // })
    interviewSheet: function(): any {
      return this.$accessor.interviewSheet.data;
    }
  },
  methods: {
    // ...mapActions('interviewSheet', {
    //   async getInterviewSheet(dispatch: any) {
    //     await dispatch('getInterviewSheet')
    //   }
    // }),
    getInterviewSheet: async function() {
      await this.$accessor.interviewSheet.getInterviewSheet();
    },
    refs(): any {
      return this.$refs
    },
    setAnswerKey(answerItem: any, questionItem: any) {
      let keyName = ''
      switch (answerItem.type) {
        case 'radio':
          keyName = this.interviewSheet.id + '_' + questionItem.id
          this.$set(this.interviewAnswers, keyName, '')
          break
        case 'checkbox':
          keyName = this.interviewSheet.id + '_' + questionItem.id
          if (!(keyName in this.interviewAnswers)) {
            this.$set(this.interviewAnswers, keyName, [])
          }
          break
        case 'number':
          keyName =
            this.interviewSheet.id + '_' + questionItem.id + '_' + answerItem.id
          this.$set(this.interviewAnswers, keyName, answerItem.num_default)
          break
        default:
          keyName =
            this.interviewSheet.id + '_' + questionItem.id + '_' + answerItem.id
          this.$set(this.interviewAnswers, keyName, '')
      }
    },
    prev() {
      if (this.refs().slider.isSliding) {
        return
      }

      const fullfilled = this.controlPage(this.currentIndex - 1)

      if (fullfilled) {
        this.currentIndex--
        this.refs().slider.slideTo(this.currentIndex)
      } else {
        // if (!(this.currentIndex in this.interviews)) {
        //   return;
        // }
        this.currentIndex--
        this.prev()
      }
      this.section = this.interviewSheet.interview_pages[
        this.currentIndex
      ].section
      this.hasNext = true
    },
    next() {
      if (this.refs().slider.isSliding) {
        return
      }

      const fullfilled = this.controlPage(this.currentIndex + 1)

      if (fullfilled) {
        this.currentIndex++
        this.refs().slider.slideTo(this.currentIndex)
      } else {
        if (!(this.currentIndex in this.interviewSheet.interview_pages)) {
          return
        }
        this.currentIndex++
        this.next()
      }

      if (!(this.currentIndex + 1 in this.interviewSheet.interview_pages)) {
        this.hasNext = false
      }
      this.section = this.interviewSheet.interview_pages[
        this.currentIndex
      ].section
    },
    after(payload: any) {
      if (payload.slideFrom == null) {
        return
      }

      // console.log(this.currentIndex);
      // console.log(this.refs().slider.$children[this.currentIndex + 1].$el.style);
      // this.contentHeight = 535 + 'px';

      window.scrollTo(0, 0)

      // if(payload.currentSlide > payload.slideFrom) {
      //   // this.page++;
      //   this.currentIndex++;
      // } else {
      //   // this.page--;
      //   this.currentIndex--;
      // }
      // this.$router.push('/interview?page=' + (this.currentIndex + 1));
    },
    /**
     * ページ制御
     */
    controlPage(nextIndex: any) {
      const pageConditions = this.interviewSheet.interview_pages[nextIndex]
        .page_conditions
      // console.log(pageConditions);

      let fullfilled = true

      for (const i in pageConditions) {
        const pageCondition = pageConditions[i]
        let text = ''

        const interviewPage = this.interviewSheet.interview_pages.find(
          (interviewPage: any) => {
            return interviewPage.id == pageCondition.interview_page_id
          }
        )

        const questionItem = interviewPage.question_items.find(
          (questionItem: any) => {
            if (questionItem.id == pageCondition.question_item_id) {
              return true
            } else {
              const childItem = questionItem.child_items.find(
                (childItem: any) => {
                  return childItem.id == pageCondition.question_item_id
                }
              )
              if (childItem !== undefined) {
                return true
              }
            }
          }
        )

        const answerItem = questionItem.answer_items.find((answerItem: any) => {
          return answerItem.id == pageCondition.answer_item_id
        })

        text = answerItem.caption

        const name =
          'input_' +
          this.interviewSheet.id +
          '_' +
          pageCondition.question_item_id +
          '_' +
          pageCondition.answer_item_id
        const partFullfilled = this.refs()[name].some((elm: any) => {
          return elm.value == text && elm.checked
        })

        if (!partFullfilled) {
          fullfilled = false
          break
        }
      }

      return fullfilled
    },
    /**
     * input numberの加算
     */
    stepUpNumber(ref: string, answerItem: any) {
      const input = this.refs()['input_' + ref][0]
      if (answerItem.num_max > input.value) {
        input.focus()
        input.stepUp(answerItem.num_interval)
        this.interviewAnswers[ref] = input.value
      }
    },
    /**
     * input numberの減算
     */
    stepDownNumber(ref: string, answerItem: any) {
      const input = this.refs()['input_' + ref][0]
      if (answerItem.num_min < input.value) {
        input.focus()
        input.stepDown(answerItem.num_interval)
        this.interviewAnswers[ref] = input.value
      }
    }
  }
})
</script>

<style lang="scss">
.hooper {
  height: 100%;
}
// .hooper-slide {
// background-color: #47da7f;
// }
.hooper,
.hooper-list,
.hooper-slide:focus {
  outline: none !important;
}
.section {
  text-align: center;
  font-size: 24px;
  padding: 15px;
}
.slide-wrap {
  padding: 30px;
  font-size: 22px;
  // color: #fff;
  .question-wrap {
    margin-top: 15px;
    .question-attention {
      font-size: 14px;
      color: #999;
    }
    .question-item-wrap {
      margin-top: 20px;
      font-size: 90%;
      .question-item-input-wrap > div {
        margin-top: 8px;
      }
    }
  }
}
.answerItem-wrap-flex {
  display: flex;
  align-items: center; /* 子要素をflexboxにより中央に配置する */
}
.btn-wrap {
  text-align: center;
  .btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    font-size: 1rem;
    // line-height: 1.5;
    border-radius: 0.25rem;
    line-height: 1;
    width: 150px;
    height: 40px;
  }
  .btn-back {
    border: 1px solid #007bff;
    color: #007bff;
  }
  .btn-next {
    margin-left: 10px;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
  .btn-next:hover {
    color: #fff;
    background-color: #0069d9;
    border-color: #0069d9;
  }
  .btn-back:hover {
    color: #fff;
    background-color: #007bff;
  }
}

.error {
  color: red;
  font-size: 90%;
}

.must {
  background: #ff1a00;
  color: #fff;
  border-radius: 3px;
  font-size: 9px;
  margin-right: 10px;
  padding: 2px 4px;
  letter-spacing: 0.2em;
}

.number-plus-btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  font-size: 1rem;
  // line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  width: 100px;
  height: 30px;
  line-height: 1;
}

.number-plus-btn:focus {
  outline: none;
}

$md-radio-checked-color: rgb(51, 122, 183);
$md-radio-border-color: #007bff;
$md-radio-size: 20px;
$md-radio-checked-size: 10px;
$md-radio-ripple-size: 15px;

.radio-inline__input {
  display: none;
  &:checked + label:before {
    // border-color: $md-radio-checked-color;
    animation: ripple 0.2s linear forwards;
  }
  &:checked + label:after {
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
  }
}

.radio-inline__label {
  position: relative;
  display: inline-block;
  padding: 0.5rem 2rem;
  margin-right: 18px;
  border-radius: 3px;
  transition: all 0.2s;
  width: 100%;
  border: 1px solid #007bff;
  color: #007bff;
  text-align: center;
  &:before,
  &:after {
    position: absolute;
    content: '';
    border-radius: 50%;
    transition: all 0.3s ease;
    transition-property: transform, border-color;
    z-index: 10000;
  }
  &:before {
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    width: $md-radio-size;
    height: $md-radio-size;
    border: 1px solid $md-radio-border-color;
  }
  &:after {
    left: 13px;
    top: 50%;
    transform: scale(0);
    width: $md-radio-checked-size;
    height: $md-radio-checked-size;
    background: $md-radio-checked-color;
  }
}

.checkbox-inline__input {
  display: none;
}
.checkbox-inline__label {
  position: relative;
  display: inline-block;
  padding: 0.5rem 2rem;
  margin-right: 18px;
  border-radius: 3px;
  transition: all 0.2s;
  width: 100%;
  border: 1px solid #007bff;
  color: #007bff;
  text-align: center;
  &:before,
  &:after {
    position: absolute;
    content: '';
    border-radius: 10%;
    transition: all 0.3s ease;
    transition-property: transform, border-color;
    z-index: 10000;
  }
  &:before {
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    width: $md-radio-size;
    height: $md-radio-size;
    border: 1px solid $md-radio-border-color;
  }
  &:after {
    content: '';
    position: absolute;
    display: block;
    box-sizing: border-box;
    width: 18px;
    height: 9px;
    margin-top: -9px;
    top: 50%;
    left: 8px;
    transform: rotate(-45deg);
    border-bottom: 3px solid;
    border-left: 3px solid;
    border-color: #007bff; /* チェックの色変更 お好きな色を */
    display: none;
  }
}
.checkbox-inline__input:checked + label::after {
  display: inline;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}

textarea {
  width: 100%;
  font: 15px/24px sans-serif;
  transition: 0.3s;
  letter-spacing: 1px;
  border: 1px solid #1b2538;
  border-radius: 4px;
}

input[type='text'],
input[type='number'] {
  font: 15px/24px sans-serif;
  box-sizing: border-box;
  padding: 0.3em;
  transition: 0.3s;
  letter-spacing: 1px;
  // color: #aaaaaa;
  border: 1px solid #1b2538;
  border-radius: 4px;
}

input[type='text'],
input[type='number'],
textarea {
  font-size: 110%;
}
input[type='text'] {
  width: 250px;
}
input[type='number'] {
  width: 100px;
}

@media (min-width: 1021px) {
  .slide-wrap {
    width: 640px;
    margin: 0 auto;
  }
}
</style>

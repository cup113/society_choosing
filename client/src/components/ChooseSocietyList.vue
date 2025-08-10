<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue';
import SocietyCard from '@/components/SocietyCard.vue';
import { useSocietyStore } from '@/stores/society';

const props = defineProps<{
    isMain?: boolean;
    title?: string;
    societies: any[];
}>();

const societyStore = useSocietyStore();

const eggs = ref<Array<{
    id: number,
    societyIndex: number,
    hatched: boolean,
    scale: number,
    opacity: number,
    x: number,
    y: number,
}>>([]);

const societyStyles = computed(() => {
    return societyStore.societies.map((_, index) => {
        const egg = eggs.value.find(e => e.societyIndex === index);
        if (egg === undefined) {
            if (societyStore.laidEggs.includes(index)) {
                return {};
            } else {
                return { opacity: 0, transform: 'scale(0)' };
            }
        } else {
            return {
                opacity: 1 - egg.opacity,
                transform: `scale(${egg.scale / EGG_MAX_SCALE})`,
            }
        }
    })
})

const containerRef = ref<HTMLElement | null>(null);
const societyCardRefs = ref<HTMLElement[]>([]);

const isMoving = ref(true);
const targetPosition = ref({ x: 0, y: 0 });
const moveSpeed = ref(0);

const HEN_SIZE = 120;
const EGG_SIZE = 30;
const EGG_MAX_SCALE = 2;

// 定时器和动画帧引用
let moveInterval: number | null = null;
let eggInterval: number | null = null;
let animationFrame: number | null = null;

const setSocietyCardRef = (el: HTMLElement | null, index: number) => {
    if (el) {
        societyCardRefs.value[index] = el;
    }
};

const calculateTargetPosition = (societyIndex: number) => {
    if (societyCardRefs.value[societyIndex] && containerRef.value) {
        const cardRect = societyCardRefs.value[societyIndex].getBoundingClientRect();
        const containerRect = containerRef.value.getBoundingClientRect();

        const cardCenterX = cardRect.left - containerRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top - containerRect.top + cardRect.height / 2;

        return {
            x: cardCenterX - HEN_SIZE / 2,
            y: cardCenterY - HEN_SIZE / 2,
        };
    }
    return { x: 0, y: 0 };
};

const calculateDirectionAndRotation = (current: { x: number, y: number }, target: { x: number, y: number }) => {
    const dx = target.x - current.x;
    const dy = target.y - current.y;

    let angle = -Math.atan2(dy, dx) * 180 / Math.PI;

    return {
        direction: { x: dx, y: dy },
        rotation: angle < -90 ? (angle + 180) : angle,
    };
};

watch(() => societyStore.societies.length, async l => {
    if (!props.isMain || l === 0) {
        return;
    }

    if (societyStore.shouldSkipAnimation || societyStore.laidEggs.length >= props.societies.length) {
        skipAnimation();
        return;
    }

    startAnimationProcess();
}, { immediate: true });

function startAnimationProcess() {
    console.log("START MOVING");
    isMoving.value = true;

    startMoving();

    eggInterval = window.setInterval(() => {
        layEgg();
    }, 2000);
}

function startMoving() {
    moveInterval = window.setInterval(() => {
        if (!isMoving.value) return;

        const nextSocietyIndex = societyStore.laidEggs.length;
        if (nextSocietyIndex < props.societies.length) {
            targetPosition.value = calculateTargetPosition(nextSocietyIndex);

            const { direction, rotation } = calculateDirectionAndRotation(
                { x: societyStore.hen.x, y: societyStore.hen.y },
                targetPosition.value
            );

            const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);

            if (distance > 0) {
                moveSpeed.value = Math.min(distance / 20, moveSpeed.value + Math.max(1, 1 / (moveSpeed.value + 0.1)));
            }

            societyStore.hen.deg = rotation;
        }
    }, 100);

    const moveHen = () => {
        if (!isMoving.value) return;

        const dx = targetPosition.value.x - societyStore.hen.x;
        const dy = targetPosition.value.y - societyStore.hen.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > moveSpeed.value) {
            societyStore.hen.x += dx / distance * moveSpeed.value;
            societyStore.hen.y += dy / distance * moveSpeed.value;
        } else {
            societyStore.hen.x = targetPosition.value.x;
            societyStore.hen.y = targetPosition.value.y;
        }

        animationFrame = requestAnimationFrame(moveHen);
    };

    animationFrame = requestAnimationFrame(moveHen);
}

function layEgg() {
    const nextSocietyIndex = societyStore.laidEggs.length;

    if (nextSocietyIndex < props.societies.length) {
        const eggId = Date.now();
        eggs.value.push({
            id: eggId,
            societyIndex: nextSocietyIndex,
            hatched: false,
            scale: 1,
            opacity: 1,
            x: societyCardRefs.value[nextSocietyIndex].offsetLeft + societyCardRefs.value[nextSocietyIndex].offsetWidth / 2 - EGG_SIZE / 2,
            y: societyCardRefs.value[nextSocietyIndex].offsetTop + societyCardRefs.value[nextSocietyIndex].offsetHeight / 2 - EGG_SIZE / 2,
        });

        societyStore.laidEggs.push(nextSocietyIndex);

        const startTime = Date.now();
        const hatchDuration = 500;

        const updateHatchAnimation = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / hatchDuration, 1);

            const egg = eggs.value.find(e => e.id === eggId);
            if (egg) {
                egg.scale = 1 + (EGG_MAX_SCALE - 1) * progress;
                egg.opacity = 1 - progress;

                if (progress < 1) {
                    requestAnimationFrame(updateHatchAnimation);
                } else {
                    egg.hatched = true;
                }
            }
        };

        setTimeout(() => requestAnimationFrame(updateHatchAnimation), 1000)
    } else {
        stopAnimation();
    }
}

function stopAnimation() {
    if (moveInterval) {
        clearInterval(moveInterval);
        moveInterval = null;
    }

    if (eggInterval) {
        clearInterval(eggInterval);
        eggInterval = null;
    }

    isMoving.value = false;
}

function skipAnimation() {
    eggs.value = [];
    societyStore.laidEggs.splice(0, societyStore.laidEggs.length, ...societyStore.societies.map((_, index) => index));

    isMoving.value = false;
}

onUnmounted(() => {
    if (moveInterval) {
        clearInterval(moveInterval);
    }
    if (eggInterval) {
        clearInterval(eggInterval);
    }
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
});
</script>

<template>
    <section ref="containerRef" class="w-full max-w-7xl mx-auto px-4 relative">
        <div v-show="!societyStore.shouldSkipAnimation && societyStore.laidEggs.length < societies.length"
            class="chicken absolute top-0 transition-transform duration-300 z-10" :style="{
                left: societyStore.hen.x + 'px',
                top: societyStore.hen.y + 'px',
                transform: `scaleX(-1) rotate(${societyStore.hen.deg}deg)`
            }">
            <img src="../assets/hen.gif" :width="HEN_SIZE" alt="Hen" />
        </div>

        <div v-for="egg in eggs" :key="egg.id" class="egg absolute transition-all duration-500 z-10" :style="{
            left: egg.x + 'px',
            top: egg.y + 'px',
            transform: `scale(${egg.scale})`,
            opacity: egg.hatched ? 0 : egg.opacity,
        }">
            <img src="../assets/egg.gif" alt="Egg" :width="EGG_SIZE" />
        </div>

        <h2 v-if="title" class="font-bold text-center text-2xl mb-6 text-amber-800 pt-16">{{ title }}</h2>
        <TransitionGroup v-if="societies.length > 0" name="fade" tag="div"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="(society, index) in societies" :key="society.id"
                :ref="(el) => setSocietyCardRef(el as HTMLElement, index)">
                <SocietyCard :society="society" class="hover-card mx-auto" :style="societyStyles[index]" />
            </div>
        </TransitionGroup>
        <div v-else class="text-center py-12 bg-amber-50 rounded-xl border-2 border-amber-200 shadow-card">
            <p class="text-amber-700 text-lg">暂无社团信息</p>
        </div>
    </section>
</template>

<style scoped>
.society-list-enter-active {
    transition: all 0.5s ease;
}

.society-list-leave-active {
    transition: all 0.5s ease;
}

.society-list-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.society-list-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
</style>

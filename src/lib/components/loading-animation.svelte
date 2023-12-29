<script lang="ts">
    const blocks = new Array(7);
</script>

<div class="c-loading">
    {#each blocks as block}
        <div class="c-loading__block"></div>
    {/each}
</div>

<style lang="scss">
    .c-loading {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;

        &__block {
            width: 10px;
            height: 0;
            background: #fff;
            margin: 0 2px;

            @for $i from 0 through 6 {
                &:nth-child(#{$i + 1}) {
                    animation: animate-height 1.5s (#{$i/5})+s infinite linear alternate;
                }
            }
        }
    }

    @keyframes animate-height {
        0% {
            height: 0;
        }
        50% {
            height: 80px;
        }
        100% {
            height: 0;
        }
    }
</style>

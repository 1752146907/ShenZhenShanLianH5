<template>
	<div class="body">
		<router-view/>
	</div>
</template>

<style src="./main.css" scoped></style>

<script>
    import mixins from '../common/mixin';

    export default {
        components: {

        },
        mixins: [mixins],
        data: () => ({

        }),
        created () {

        },
        mounted () {
			// 删除入场loading
			let Loading = document.getElementById('Loading');
			Loading.style.display = "none";
			window.scrollTo(0, 0);
        },
        methods: {

        }
    }
</script>

import type { MaybeRef } from "vue";
/**
 * JSONシリアライゼーションを使用して値のディープクローンを作成します。
 * 注意：循環参照を含む値やDate、Map、Setなどの特殊なオブジェクトには対応していません
 * @param value - クローンする値
 * @returns オブジェクトの場合はディープクローン、それ以外の場合は値そのものを返す
 */
export function defaultClone(value: unknown) {
  // プリミティブ値とnullはクローン不要
  if (value === null || typeof value !== "object") return value;
  // オブジェクト/配列のディープクローンにJSONシリアライゼーションを使用
  return JSON.parse(JSON.stringify(value));
}

/**
 * 初期値を保持可能なリセット可能な参照を作成します
 * @template T - 保存する値の型
 * @param value - 参照の初期値
 * @param clone - オプションのクローン関数（デフォルトはJSONベースのクローン）
 * @returns 以下のプロパティを含むオブジェクト:
 *   - state: 現在の値のリアクティブな参照
 *   - reset: 状態を初期（クローン）値にリセットする関数
 */
export function useResettableRef<T>(value: T, clone = defaultClone) {
  // クローンされた初期値を保存
  const initialValue = clone(value);
  // リアクティブな参照を作成
  const state = ref(value);
  // 初期値にリセットする関数
  const reset = () => {
    state.value = clone(initialValue);
  };
  return { state, reset };
}

/**
 * イベントリスナーが追加可能な対象の型定義
 * Window、Document、HTMLElement、または一般的なEventTargetを包含
 */
type EventTargetLike = Window | Document | HTMLElement | EventTarget;

/**
 * イベントリスナーを管理するComposition API関数
 * @overloads
 *  - ウィンドウイベント用簡易版: useEventListener(event, handler, options?)
 *  - 汎用版: useEventListener(target, event, handler, options?)
 */
export function useEventListener(
  ...args:
    | [
        target: MaybeRef<EventTargetLike | string | object>, // 対象要素（Ref可能/文字列/オブジェクト）
        event: string, // イベント名
        handler: EventListenerOrEventListenerObject, // イベントハンドラ
        options?: boolean | AddEventListenerOptions // オプション
      ]
    | [
        event: string, // イベント名（ウィンドウ対象）
        handler: EventListenerOrEventListenerObject, // イベントハンドラ
        options?: boolean | AddEventListenerOptions // オプション
      ]
) {
  // 第一引数が文字列の場合windowを対象に設定、それ以外は引数から要素を取得
  const element =
    typeof args[0] === "string" ? window : (args.shift() as EventTargetLike);

  // 残りの引数をイベント登録用パラメータとして型アサーション
  const argsEvent = args as [
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ];

  // クリーンアップ関数の初期化
  let cleanup = () => {};

  // 対象要素の変化を監視
  const stopWatch = watch(
    () => {
      // Refの場合は値を取得
      const el = unref(element);
      // 有効なEventTargetLike型であることを確認
      return el && (el as EventTargetLike);
    },
    (el: EventTargetLike | null) => {
      // 既存のリスナーを削除
      cleanup();
      if (!el) return;

      // 新しいリスナーを登録
      el.addEventListener(...argsEvent);
      // クリーンアップ関数を更新
      cleanup = () => el.removeEventListener(...argsEvent);
    },
    { immediate: true } // 初期化時即時実行
  );

  // リスナー解除用関数
  const stop = () => {
    cleanup(); // イベントリスナーを解除
    stopWatch(); // 監視を停止
  };

  // スコープ破棄時に自動クリーンアップ
  onScopeDispose(stop);

  return stop;
}

/**
 * 非同期関数をラップし、同じ引数での重複呼び出しを防ぐ
 *
 * @template Args - 関数の引数の型（任意の配列型）
 * @template Result - 非同期関数の戻り値の型
 * @param cb - ラップ対象の非同期関数 (...args: Args) => Promise<Result>
 * @returns 重複呼び出しを防ぐ新しい非同期関数
 */
export function asyncOnce<Args extends unknown[], Result>(
  cb: (...args: Args) => Promise<Result>
) {
  // キャッシュ用のマップ（キー: 引数のJSON文字列, 値: Promise<Result> | null）
  const map: Record<string, null | Promise<Result>> = {};

  return (...args: Args): Promise<Result> => {
    // 引数をJSON文字列に変換してキャッシュキーとして使用
    const key = JSON.stringify(args);

    // キャッシュが存在しない場合のみ新しいPromiseを作成
    return (map[key] ??= new Promise((resolve, reject) => {
      cb(...args)
        .then(resolve) // 成功時は結果を解決
        .catch(reject) // 失敗時はエラーを拒否
        .finally(() => {
          map[key] = null; // 処理完了後にキャッシュをクリア
        });
    }));
  };
}
